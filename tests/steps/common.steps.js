import { When, Then, Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ─── Universal Click ───────────────────────────────────────────
When('I click {string}', async function (text) {
  await this.page.click(`text="${text}"`);
  await this.page.waitForTimeout(500);
});

// ─── Universal Visibility ──────────────────────────────────────
Then('I should see {string}', async function (text) {
  await expect(this.page.locator(`text="${text}"`).first()).toBeVisible({ timeout: 5000 });
});

Then('I should see {string} on the screen', async function (text) {
  await expect(this.page.locator(`text="${text}"`).first()).toBeVisible({ timeout: 5000 });
});

Then('I should see a link to {string}', async function (linkText) {
  await expect(this.page.locator(`text="${linkText}"`)).toBeVisible();
});

Then('I should see an {string} button', async function (btnText) {
  // Use filter with hasText or getByRole for more robust detection
  const btn = this.page.locator('button, [role="button"], a.btn, .glass-card button').filter({ hasText: btnText });
  await expect(btn.first()).toBeVisible({ timeout: 5000 });
});

// ─── Universal Modal ───────────────────────────────────────────
Then('a modal dialog should appear with title {string}', async function (title) {
  const modal = this.page.locator(`text="${title}"`);
  await expect(modal).toBeVisible({ timeout: 3000 });
});

Then('a modal should appear with title {string}', async function (title) {
  const modal = this.page.locator(`text="${title}"`);
  await expect(modal).toBeVisible({ timeout: 3000 });
});

Then('a modal dialog should appear', async function () {
  const modal = this.page.locator('[role="dialog"], .modal-panel, .fixed.inset-0').first();
  await expect(modal).toBeVisible();
});

Then('the modal should not be visible', async function () {
  await this.page.waitForTimeout(500);
  const modals = this.page.locator('[role="dialog"], .modal-panel');
  const count = await modals.count();
  expect(count).toBe(0);
});

When('I close the modal', async function () {
  await this.page.keyboard.press('Escape');
  await this.page.waitForTimeout(500);
});

// ─── Page Headings ─────────────────────────────────────────────
Then('the page heading should contain {string}', async function (text) {
  const heading = this.page.locator('h1, h2, [class*="title"]').first();
  await expect(heading).toContainText(text, { timeout: 5000 });
});
