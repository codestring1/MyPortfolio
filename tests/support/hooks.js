import { chromium } from '@playwright/test';
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(30000);

let browser;

BeforeAll(async function () {
  browser = await chromium.launch({
    headless: process.env.HEADLESS === 'true',
    slowMo: 100
  });
});

AfterAll(async function () {
  if (browser) await browser.close();
});

Before(async function () {
  this.context = await browser.newContext({
    baseURL: 'http://localhost:3000',
    viewport: { width: 1280, height: 720 }
  });
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  // Take screenshot on failure if page was successfully initialized
  if (this.page && scenario.result?.status === 'FAILED') {
    try {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    } catch (e) {
      console.warn('Could not take screenshot:', e.message);
    }
  }
  
  if (this.context) {
    await this.context.close();
  }
});
