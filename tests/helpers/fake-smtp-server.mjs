import { createServer as createHttpServer } from 'node:http';
import { createServer as createTcpServer } from 'node:net';
import { pathToFileURL } from 'node:url';

export async function startFakeSmtp({ smtpPort = 13025, apiPort = 18025, host = '127.0.0.1' } = {}) {
  const messages = [];
  const smtp = createTcpServer(socket => {
    socket.setEncoding('utf8');
    socket.write('220 fake-smtp.test ESMTP\r\n');
    let buffer = '', data = false, raw = '', recipient = '';
    socket.on('data', chunk => {
      buffer += chunk;
      while (buffer.includes('\n')) {
        const end = buffer.indexOf('\n') + 1;
        const line = buffer.slice(0, end); buffer = buffer.slice(end);
        if (data) {
          if (line === '.\r\n' || line === '.\n') {
            messages.push({ id: messages.length + 1, recipient, raw, acceptedAt: new Date().toISOString() });
            data = false; raw = ''; socket.write('250 2.0.0 accepted\r\n');
          } else raw += line.startsWith('..') ? line.slice(1) : line;
          continue;
        }
        const command = line.trim();
        if (/^(EHLO|HELO)\b/i.test(command)) socket.write('250-fake-smtp.test\r\n250 8BITMIME\r\n');
        else if (/^MAIL FROM:/i.test(command)) { recipient = ''; socket.write('250 2.1.0 ok\r\n'); }
        else if (/^RCPT TO:/i.test(command)) { recipient = command.replace(/^RCPT TO:\s*/i, '').replace(/[<>]/g, ''); socket.write('250 2.1.5 ok\r\n'); }
        else if (/^DATA$/i.test(command)) { data = true; socket.write('354 end with <CRLF>.<CRLF>\r\n'); }
        else if (/^RSET$/i.test(command)) { data = false; raw = ''; recipient = ''; socket.write('250 2.0.0 reset\r\n'); }
        else if (/^QUIT$/i.test(command)) { socket.end('221 2.0.0 bye\r\n'); }
        else socket.write('250 2.0.0 ok\r\n');
      }
    });
  });
  const api = createHttpServer((request, response) => {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname;
    if (request.method === 'GET' && pathname === '/messages') {
      response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      response.end(JSON.stringify(messages));
    } else if (request.method === 'DELETE' && pathname === '/messages') {
      messages.length = 0; response.writeHead(204).end();
    } else response.writeHead(404).end('Not found');
  });
  await Promise.all([
    new Promise(resolve => smtp.listen(smtpPort, host, resolve)),
    new Promise(resolve => api.listen(apiPort, host, resolve))
  ]);
  return {
    smtpPort: smtp.address().port, apiPort: api.address().port,
    close: () => Promise.all([new Promise(resolve => smtp.close(resolve)), new Promise(resolve => api.close(resolve))])
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const server = await startFakeSmtp({
    smtpPort: Number(process.env.FAKE_SMTP_PORT || 13025),
    apiPort: Number(process.env.FAKE_SMTP_API_PORT || 18025)
  });
  process.stdout.write(`Fake SMTP listening on 127.0.0.1:${server.smtpPort}; API 127.0.0.1:${server.apiPort}\n`);
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await server.close(); process.exit(0); });
}
