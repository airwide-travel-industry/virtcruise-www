import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { launchChromium } from './helpers/playwright-runtime.mjs';
import { waitForApplicationReady } from './helpers/browser-acceptance.mjs';

const enabled = process.env.RUN_FINANCIAL_BROWSER_INTEGRATION === 'true';
const frontend = process.env.FINANCIAL_FRONTEND_URL || 'http://127.0.0.1:5002';
const backend = process.env.FINANCIAL_BACKEND_URL || 'http://127.0.0.1:8080';
const localKey = process.env.LOCAL_AUTH_TEST_KEY || '';
const databaseContainer = process.env.POSTGRES_CONTAINER || 'virtcruise-backend-postgres-1';

function sql(statement) {
  return execFileSync('docker', [
    'exec', databaseContainer, 'psql', '-v', 'ON_ERROR_STOP=1',
    '-U', 'virtcruise', '-d', 'virtcruise', '-Atc', statement
  ], { encoding: 'utf8' }).trim();
}

async function developmentToken(email, purpose) {
  const url = new URL('/api/v1/auth/development/token', backend);
  url.searchParams.set('email', email);
  url.searchParams.set('purpose', purpose);
  const response = await fetch(url, { headers: { 'X-Local-Test-Key': localKey } });
  assert.equal(response.ok, true);
  return (await response.json()).data.token;
}

test('real PostgreSQL financial portal customer journeys', { skip: !enabled, timeout: 120_000 }, async () => {
  assert.ok(localKey.length >= 24, 'A local-only token retrieval key is required');
  const browser = await launchChromium({
    headless: true,
    args: ['--no-sandbox']
  });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();
  const consoleErrors = [];
  const requestFailures = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => {
    if (!request.failure()?.errorText.includes('ERR_ABORTED')) requestFailures.push(request.url());
  });

  const unique = Date.now();
  const email = `dev004c-${unique}@example.test`;
  const password = `Portal-${unique}-Safe!`;
  const otherCustomer = crypto.randomUUID();
  let accountId;
  const invoiceId = crypto.randomUUID();
  const paymentId = crypto.randomUUID();
  const receiptId = crypto.randomUUID();
  const refundId = crypto.randomUUID();
  const depositId = crypto.randomUUID();
  const otherAccount = crypto.randomUUID();
  const otherInvoice = crypto.randomUUID();

  try {
    await page.goto(`${frontend}/register/?api=local`);await waitForApplicationReady(page);
    await page.getByLabel('First name').fill('Financial');
    await page.getByLabel('Last name').fill('Traveller');
    await page.getByLabel('Email').fill(email);
    await page.locator('#password').fill(password);
    await page.locator('#confirmPassword').fill(password);
    await page.getByLabel(/terms/i).check();
    await page.getByLabel(/privacy/i).check();
    await page.getByRole('button', { name: /create account/i }).click();
    await page.getByText(/check your email/i).waitFor();

    const verification = await developmentToken(email, 'VERIFICATION');
    await page.goto(`${frontend}/verify-email/?api=local&token=${encodeURIComponent(verification)}`);await waitForApplicationReady(page);
    await page.getByText(/verified|verification complete/i).waitFor();

    await page.goto(`${frontend}/signin/?api=local`);await waitForApplicationReady(page);
    await page.getByLabel('Email').fill(email);
    await page.locator('#password').fill(password);
    await page.getByRole('button', { name: /^sign in$/i }).click();
    await page.waitForURL(/\/(?:account|dashboard)\//);

    await page.goto(`${frontend}/financial/?api=local`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
    await page.getByRole('heading', { name: 'Financial Overview' }).waitFor();
    assert.equal(await page.getByText('No outstanding balance', { exact: true }).isVisible(), true);

    const customerId = sql(`select customer_id from user_accounts where normalized_email=lower('${email}')`);
    assert.match(customerId, /^[0-9a-f-]{36}$/);
    accountId = sql(`select id from financial_accounts where customer_id='${customerId}' and currency='ZAR'`);
    assert.match(accountId, /^[0-9a-f-]{36}$/);
    sql(`begin;
      insert into customers(id,email,normalized_email,first_name,last_name,created_at,updated_at,created_by,updated_by,version)
        values ('${otherCustomer}','other-${unique}@example.test','other-${unique}@example.test','Other','Customer',now(),now(),'dev004c','dev004c',0);
      update financial_accounts set debit_total=5000,credit_total=2000,updated_at=now(),updated_by='dev004c'
        where id='${accountId}';
      insert into financial_accounts(id,customer_id,currency,status,debit_total,credit_total,version,created_at,updated_at,created_by,updated_by)
        values ('${otherAccount}','${otherCustomer}','ZAR','OPEN',100,0,0,now(),now(),'dev004c','dev004c');
      insert into financial_invoices(id,invoice_number,account_id,customer_id,booking_reference,currency,status,allocated_amount,credited_amount,version,created_at,updated_at,created_by,updated_by)
        values ('${invoiceId}','INV-DEV004C-${unique}','${accountId}','${customerId}','VC-DEV004C-${unique}','ZAR','PARTIALLY_PAID',2000,0,0,now(),now(),'dev004c','dev004c'),
               ('${otherInvoice}','INV-OTHER-${unique}','${otherAccount}','${otherCustomer}',null,'ZAR','ISSUED',0,0,0,now(),now(),'dev004c','dev004c');
      insert into financial_invoice_lines(invoice_id,position,description,quantity,unit_price,tax_rate)
        values ('${invoiceId}',0,'Controlled PostgreSQL browser fixture',1,5000,0),
               ('${otherInvoice}',0,'Other customer fixture',1,100,0);
      insert into financial_payments(id,payment_reference,customer_id,booking_reference,amount,currency,method,idempotency_key,status,refunded_amount,version,created_at,updated_at,created_by,updated_by)
        values ('${paymentId}','PAY-DEV004C-${unique}','${customerId}','VC-DEV004C-${unique}',2500,'ZAR','BANK_TRANSFER','dev004c-payment-${unique}','PARTIALLY_ALLOCATED',250,0,now(),now(),'dev004c','dev004c');
      insert into financial_payment_allocations(payment_id,invoice_number,amount)
        values ('${paymentId}','INV-DEV004C-${unique}',2000);
      insert into financial_receipts(id,receipt_number,customer_id,payment_reference,booking_reference,currency,status,version,created_at,updated_at,created_by,updated_by)
        values ('${receiptId}','REC-DEV004C-${unique}','${customerId}','PAY-DEV004C-${unique}','VC-DEV004C-${unique}','ZAR','ISSUED',0,now(),now(),'dev004c','dev004c');
      insert into financial_receipt_allocations(receipt_id,invoice_number,amount)
        values ('${receiptId}','INV-DEV004C-${unique}',2000);
      insert into financial_refunds(id,payment_reference,amount,currency,reason,idempotency_key,status,version,created_at,updated_at,created_by,updated_by)
        values ('${refundId}','PAY-DEV004C-${unique}',250,'ZAR','Controlled customer refund','dev004c-refund-${unique}','COMPLETED',0,now(),now(),'dev004c','dev004c');
      insert into financial_deposits(id,account_id,booking_reference,required_amount,received_amount,currency,due_date,status,version,created_at,updated_at,created_by,updated_by)
        values ('${depositId}','${accountId}','VC-DEV004C-${unique}',1500,500,'ZAR',current_date + 30,'PARTIALLY_PAID',0,now(),now(),'dev004c','dev004c');
      commit;`);

    for (const viewport of [
      { width: 1920, height: 1080 },
      { width: 1024, height: 768 },
      { width: 390, height: 844 }
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`${frontend}/financial/invoices/?api=local`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
      await page.getByText(`INV-DEV004C-${unique}`, { exact: true }).waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    }

    await page.goto(`${frontend}/financial/invoices/details/?api=local&id=${invoiceId}`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
    assert.equal(await page.getByText('Controlled PostgreSQL browser fixture').isVisible(), true);
    await page.goto(`${frontend}/financial/payments/?api=local`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
    assert.equal(await page.getByText(`PAY-DEV004C-${unique}`, { exact: true }).isVisible(), true);
    await page.goto(`${frontend}/financial/receipts/?api=local`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
    assert.equal(await page.getByText(`REC-DEV004C-${unique}`, { exact: true }).isVisible(), true);
    await page.goto(`${frontend}/financial/refunds/?api=local`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
    assert.equal(await page.getByText('Controlled customer refund').isVisible(), true);

    await page.goto(`${frontend}/financial/invoices/details/?api=local&id=${otherInvoice}`, { waitUntil:'domcontentloaded' });await waitForApplicationReady(page);
    assert.equal(await page.getByRole('heading', { name: 'Financial information unavailable' }).isVisible(), true);

    const storage = await page.evaluate(() => ({
      local: Object.fromEntries(Object.entries(localStorage)),
      session: Object.fromEntries(Object.entries(sessionStorage))
    }));
    assert.doesNotMatch(JSON.stringify(storage), /INV-DEV004C|PAY-DEV004C|accessToken|refreshToken/);
    assert.deepEqual(consoleErrors.filter(message => !message.includes('status of 403')), []);
    assert.deepEqual(requestFailures, []);

    await page.getByRole('button', { name: 'Logout' }).click();
    await page.goto(`${frontend}/financial/?api=local`);await waitForApplicationReady(page);
    await page.waitForURL(/\/signin\//);
  } finally {
    await context.close();
    await browser.close();
  }
});
