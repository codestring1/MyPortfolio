import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ─── When Steps ────────────────────────────────────────────────

When('I click {string} in the sidebar navigation', async function (menuItem) {
  // Finds the sidebar link by text and clicks it
  await this.page.click(`nav >> text="${menuItem}"`);
  await this.waitForLoad();
});

When('I navigate directly to {string}', async function (path) {
  await this.goto(path);
  await this.waitForLoad();
});

When('I click the logout button', async function () {
  const logoutBtn = this.page.locator('button:has-text("Logout"), [aria-label="Logout"], .logout-btn').first();
  await logoutBtn.click();
  await this.waitForLoad();
});

// ─── Then Steps ────────────────────────────────────────────────

Then('the URL should contain {string}', async function (segment) {
  await expect(this.page).toHaveURL(new RegExp(segment));
});

Then('I should not be able to access protected routes', async function () {
  await this.goto('/skills');
  await this.page.waitForURL('**/login');
  expect(this.page.url()).toContain('/login');
});
