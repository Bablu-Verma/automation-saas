import puppeteer from 'puppeteer';

// Simple delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function autoSaveN8nWorkflow(workflowId: string) {
  const browser = await puppeteer.launch({
    headless: true, // keep headless, set false if debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--start-maximized',
      '--incognito',
    ],
    defaultViewport: null,
  });

  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  try {
   
    await page.authenticate({
      username: process.env.CADDY_USER!,
      password: process.env.CADDY_PASS!,
    });
    await delay(500);

    const n8nUrl = `${process.env.N8N_API_URL}/workflow/${workflowId}`;
   
    await page.goto(n8nUrl, { waitUntil: 'networkidle2' });

    await delay(4000);

    await page.waitForSelector('input[name="emailOrLdapLoginId"]', { visible: true });
    await delay(1000);

   
    await page.type('input[name="emailOrLdapLoginId"]', process.env.N8N_USER_EMAIL!);
    await page.type('input[name="password"]', process.env.N8N_USER_PASSWORD!);

    await page.click('button[data-test-id="form-submit-button"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  
    await page.waitForSelector('[data-test-id="canvas-wrapper"]', { visible: true });

    await delay(800);

   
    const addStickyBtn = await page.$('button[data-test-id="add-sticky-button"]');
    await addStickyBtn?.click();

    await delay(1500);


    await page.waitForSelector('span[data-test-id="workflow-save-button"] button', { visible: true, timeout: 25000 });

 
    await page.waitForFunction(() => {
      const btn = document.querySelector('span[data-test-id="workflow-save-button"] button') as HTMLButtonElement;
      return !!btn && !btn.disabled;
    }, { timeout: 25000 });
    await page.click('span[data-test-id="workflow-save-button"] button');

    await delay(2500);

    await page.waitForFunction(() => {
      const saved = document.querySelector('span[data-test-id="workflow-save-button"] span');
      return saved && saved.textContent?.trim().includes('Saved');
    }, { timeout: 80000 });

    console.log(`🎉 Workflow ${workflowId} auto-saved successfully!`);

  } catch (error) {
    console.error('❌ Error occurred:', error);
  } finally {
    await browser.close();
    console.log(`🧹 Browser closed for workflow: ${workflowId}`);
  }
}
