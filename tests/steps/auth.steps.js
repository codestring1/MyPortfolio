import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ─── Given Steps ───────────────────────────────────────────────

Given('I am on the Login page', async function () {
  await this.goto('/login');
  await this.waitForLoad();
});

Given('I am on the Signup page', async function () {
  await this.goto('/signup');
  await this.waitForLoad();
});

Given('I am NOT logged in', async function () {
  await this.context.clearCookies();
  await this.page.evaluate(() => localStorage.clear());
});

Given('I am logged in and on the Home dashboard', async function () {
  await this.loginViaUI();
  await this.goto('/');
  await this.waitForLoad();
});

// ─── When Steps ────────────────────────────────────────────────

When('I enter a valid email and password', async function () {
  await this.page.fill('input[type="email"]', this.testEmail);
  await this.page.fill('input[type="password"]', this.testPassword);
});

When('I enter email {string} and password {string}', async function (email, password) {
  await this.page.fill('input[type="email"]', email);
  await this.page.fill('input[type="password"]', password);
});

When('I click the login submit button', async function () {
  await this.page.click('button[type="submit"]');
  await this.page.waitForTimeout(2000);
});

When('I click the signup submit button', async function () {
  await this.page.click('button[type="submit"]');
  await this.page.waitForTimeout(2000);
});

// ... (common click step moved to common.steps.js)

// ─── Then Steps ────────────────────────────────────────────────

Then('I should be redirected to the Home dashboard', async function () {
  await this.page.waitForURL('**/', { timeout: 15000 });
  const url = this.page.url();
  expect(url).toContain('localhost:3000');
});

Then('I should see a login error message', async function () {
  const errorEl = this.page.locator('.text-errorRed, [class*="errorRed"]').first();
  await expect(errorEl).toBeVisible({ timeout: 5000 });
});

Then('the login submit button should require email and password', async function () {
  const emailInput = this.page.locator('input[type="email"]');
  const required = await emailInput.getAttribute('required');
  expect(required).not.toBeNull();
});

// ... (common visibility steps moved to common.steps.js)

Then('I should be on the Forgot Password page', async function () {
  await this.page.waitForURL('**/forgot-password');
  const url = this.page.url();
  expect(url).toContain('forgot-password');
});

Then('I should be redirected to the Login page', async function () {
  await this.page.waitForURL('**/login', { timeout: 5000 });
  const url = this.page.url();
  expect(url).toContain('login');
});
