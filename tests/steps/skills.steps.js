import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// ─── Given Steps ───────────────────────────────────────────────

Given('I am logged in and on the Skills page', async function () {
  await this.loginViaUI();
  await this.goto('/skills');
  await this.waitForLoad();
});

Given('the skills list is empty', async function () {
  // This step assumes no skills in test account or checks current state
  const emptyMsg = this.page.locator('text="No capabilities logged."');
  // If not empty, just proceed — message won't appear
});

Given('at least one skill exists in the list', async function () {
  // Verify at least one skill card is rendered
  const cards = this.page.locator('.glass-card');
  const count = await cards.count();
  if (count === 0) {
    this.skip(); // Skip if no data — requires seeded test account
  }
});

// ─── When Steps ────────────────────────────────────────────────

// ... (common click step moved to common.steps.js)

// ... (common modal steps moved to common.steps.js)

// ─── Then Steps ────────────────────────────────────────────────

// ... (common heading and visibility steps moved to common.steps.js)

Then('each skill card should display a name and a proficiency badge', async function () {
  const cards = this.page.locator('.glass-card');
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  // Check first card has h4 (name) and a badge span
  const firstCard = cards.first();
  await expect(firstCard.locator('h4')).toBeVisible();
  await expect(firstCard.locator('span')).toBeVisible();
});
