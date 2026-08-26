import assert from 'node:assert/strict';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:https';
import { request as httpRequest } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { launchChromium } from '../tests/helpers/playwright-runtime.mjs';

const frontendHost = 'www.virtcruisetravels.com';
const apiHost = 'api.virtcruisetravels.com';
const frontendOrigin = `https://${frontendHost}`;
const apiOrigin = `https://${apiHost}`;
const root = resolve(process.env.WEB001A_ARTIFACT_ROOT || 'dist/virtcruise-www-webdev-v0.8.0-dev');
const key = await readFile(process.env.WEB001A_TLS_KEY);
const cert = await readFile(process.env.WEB001A_TLS_CERT);
const localKey = process.env.LOCAL_AUTH_TEST_KEY || '';
const port = Number(process.env.WEB001A_HTTPS_PORT || 18443);
let password = 'Branded-Acceptance-2026!';
const email = `web001a-${Date.now()}@test.invalid`;
const types = { '.css':'text/css; charset=utf-8','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.xml':'application/xml; charset=utf-8' };

function proxy(clientRequest, clientResponse) {
  const path = new URL(clientRequest.url, apiOrigin).pathname;
  if (!(path.startsWith('/api/') || path === '/actuator/health')) {
    clientResponse.writeHead(404, { 'Cache-Control':'no-store' }).end('Not found'); return;
  }
  const headers = { ...clientRequest.headers, host:apiHost, 'x-forwarded-proto':'https',
    'x-forwarded-host':apiHost, 'x-forwarded-for':clientRequest.socket.remoteAddress || '127.0.0.1' };
  const upstream = httpRequest({ hostname:'127.0.0.1', port:8080, method:clientRequest.method,
    path:clientRequest.url, headers }, response => {
    clientResponse.writeHead(response.statusCode, response.headers); response.pipe(clientResponse);
  });
  upstream.on('error', () => clientResponse.writeHead(502).end('Bad gateway'));
  clientRequest.pipe(upstream);
}

function serve(request, response) {
  if (request.headers.host?.split(':')[0] === apiHost) return proxy(request, response);
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, frontendOrigin).pathname); } catch { response.writeHead(400).end(); return; }
  let target = resolve(root, normalize(pathname).replace(/^[/\\]+/, ''));
  if (target !== root && !target.startsWith(`${root}${sep}`)) { response.writeHead(403).end(); return; }
  if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
  if (!existsSync(target) || !statSync(target).isFile()) { response.writeHead(404).end('Not found'); return; }
  response.writeHead(200, { 'Content-Type':types[extname(target)] || 'application/octet-stream',
    'Cache-Control':extname(target)==='.html'?'no-cache':'public, max-age=3600',
    'Content-Security-Policy':`default-src 'self'; connect-src 'self' ${apiOrigin}; img-src 'self' blob:; frame-src blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'`,
    'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin',
    'Permissions-Policy':'camera=(), microphone=(), geolocation=()' });
  createReadStream(target).pipe(response);
}

const server = createServer({ key, cert }, serve);
await new Promise((resolvePromise, reject) => server.once('error',reject).listen(port,'127.0.0.1',resolvePromise));
const browser = await launchChromium({ headless:true,
  args:['--no-sandbox',`--host-resolver-rules=MAP ${frontendHost}:443 127.0.0.1:${port},MAP ${apiHost}:443 127.0.0.1:${port},EXCLUDE localhost`] });

try {
  const context = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1920,height:1080}, reducedMotion:'reduce' });
  const page = await context.newPage(); const errors=[]; const failures=[];
  page.on('console', message => { if (message.type()==='error') errors.push(message.text()); });
  page.on('requestfailed', request => { if (!request.failure()?.errorText.includes('ERR_ABORTED')) failures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`); });
  await page.goto(`${frontendOrigin}/register/`); await page.getByLabel('First name').fill('Branded');
  await page.getByLabel('Last name').fill('Acceptance'); await page.getByLabel('Email').fill(email);
  await page.locator('#password').fill(password); await page.locator('#confirmPassword').fill(password);
  await page.getByLabel(/terms/i).check(); await page.getByLabel(/privacy/i).check();
  await page.getByRole('button',{name:/create account/i}).click(); await page.getByText(/check your email/i).waitFor();
  const tokenResponse = await fetch(`http://127.0.0.1:8080/api/v1/auth/development/token?email=${encodeURIComponent(email)}&purpose=VERIFICATION`,{headers:{'X-Local-Test-Key':localKey}});
  assert.equal(tokenResponse.status,200); const verification=(await tokenResponse.json()).data.token;
  await page.goto(`${frontendOrigin}/verify-email/?token=${encodeURIComponent(verification)}`); await page.getByText(/verified|verification complete/i).waitFor();
  await page.goto(`${frontendOrigin}/signin/`); await page.getByLabel('Email address').fill(email); await page.locator('#password').fill(password);
  await Promise.all([page.waitForURL(/\/(?:account|dashboard)\//),page.getByRole('button',{name:/sign in/i}).click()]);
  const cookies=await context.cookies(); const refresh=cookies.find(value=>value.name==='VC_REFRESH'); const csrf=cookies.find(value=>value.name==='XSRF-TOKEN');
  assert.ok(refresh?.secure && refresh.httpOnly && refresh.sameSite==='Lax' && refresh.path==='/api/v1/auth');
  assert.ok(csrf?.secure && !csrf.httpOnly && csrf.sameSite==='Lax');
  await page.reload(); await page.getByRole('button',{name:'Logout'}).waitFor();
  const csrfResponse=await page.evaluate(async origin=>{const response=await fetch(`${origin}/api/v1/auth/csrf`,{credentials:'include'});return response.status;},apiOrigin); assert.equal(csrfResponse,200);
  for (const viewport of [{width:1920,height:1080},{width:1024,height:768},{width:390,height:844}]) {
    await page.setViewportSize(viewport); await page.goto(`${frontendOrigin}/account/`,{waitUntil:'domcontentloaded'}); await page.getByRole('button',{name:'Logout'}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  }
  const storage=await page.evaluate(()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage}}));
  assert.doesNotMatch(storage,/accessToken|refreshToken|VC_REFRESH|XSRF-TOKEN/i);
  await page.getByRole('button',{name:'Logout all devices'}).click(); await page.waitForURL(/\/signin\//);
  await page.goto(`${frontendOrigin}/forgot-password/`); await page.getByLabel('Email address').fill(email); await page.locator('#forgotForm').evaluate(form=>form.requestSubmit()); await page.getByText('Check your email').waitFor();
  const resetResponse = await fetch(`http://127.0.0.1:8080/api/v1/auth/development/token?email=${encodeURIComponent(email)}&purpose=PASSWORD_RESET`,{headers:{'X-Local-Test-Key':localKey}});
  assert.equal(resetResponse.status,200); const resetToken=(await resetResponse.json()).data.token; password='Branded-New-Password-2026!';
  await page.goto(`${frontendOrigin}/reset-password/?token=${encodeURIComponent(resetToken)}`); await page.locator('#newPassword').fill(password); await page.locator('#confirmPassword').fill(password); await page.locator('#resetForm').evaluate(form=>form.requestSubmit()); await page.getByText(/password.*changed|password.*reset/i).waitFor();
  await page.goto(`${frontendOrigin}/signin/`); await page.getByLabel('Email address').fill(email); await page.locator('#password').fill(password); await Promise.all([page.waitForURL(/\/(?:account|dashboard)\//),page.getByRole('button',{name:/sign in/i}).click()]);
  await page.goto(`${frontendOrigin}/account/`); await page.getByRole('button',{name:'Logout'}).click(); await page.waitForURL(/index\.html|signin/);
  await page.goto(`${frontendOrigin}/financial/`); await page.waitForURL(/\/signin\//); await page.goBack(); await page.waitForTimeout(500); assert.doesNotMatch(page.url(),/\/financial\//);
  for (const route of ['/', '/packages/victoria-falls-escape.html','/register/','/verify-email/','/signin/','/forgot-password/','/reset-password/','/dashboard/','/profile/','/quotes/','/bookings/','/trips/','/financial/','/bank-transfer/','/finance/']) {
    const status=await page.evaluate(async routeValue=>(await fetch(routeValue)).status,route); assert.equal(status,200,route);
  }
  const home=await page.evaluate(async()=>(await fetch('/')).text()); assert.match(home,/rel="canonical" href="https:\/\/www\.virtcruisetravels\.com\/"/);
  assert.deepEqual(errors,[]); assert.deepEqual(failures,[]);
  console.log(JSON.stringify({registration:true,verification:true,login:true,restoration:true,csrf:true,logout:true,logoutAll:true,passwordReset:true,backProtection:true,secureLaxCookie:true,routes:15,storage:true,viewports:3}));
  await context.close();
} finally { await browser.close(); await new Promise(resolvePromise=>server.close(resolvePromise)); }
