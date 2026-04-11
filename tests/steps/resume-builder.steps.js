import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am logged in and on the Resumes page', async function () {
  await this.loginViaUI();
  await this.goto('/resumes');
  await this.waitForLoad();
});

When('I click {string} or {string} button', async function (btn1, btn2) {
  const btn = this.page.locator(`text="${btn1}", text="${btn2}"`).first();
  await btn.click();
  await this.waitForLoad();
});

Then('the Resume Builder iframe/page should load', async function () {
  // Check for the iframe or the builder container
  const builder = this.page.locator('iframe, #resume-builder-root');
  await expect(builder).toBeVisible({ timeout: 10000 });
});

Then('the name field should be pre-populated with my profile name', async function () {
  // Accessing inside iframe if necessary
  const frame = this.page.frameLocator('iframe').first();
  const nameInput = frame.locator('input[placeholder*="Name"], #name-input').first();
  await expect(nameInput).not.toHaveValue('');
});
