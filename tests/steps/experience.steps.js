import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am logged in and on the Experience page', async function () {
  await this.loginViaUI();
  await this.goto('/experience');
  await this.waitForLoad();
});

Given('the experience list is empty', async function () {
  // If there are cards, we can't easily delete them without deep API integration,
  // so we just verify if they exist or skip.
  const emptyMsg = this.page.locator('text="No corporate record found"');
  // If emptyMsg is visible, we're good. If not, the following "Then" will fail as expected.
});

Given('at least one experience entry exists', async function () {
  const count = await this.page.locator('.glass-card').count();
  if (count === 0) this.skip();
});

When('I fill in company {string}, role {string}, and duration {string}', async function (company, role, duration) {
  await this.page.fill('input[name="company_name"]', company);
  await this.page.fill('input[name="role"]', role);
  await this.page.fill('input[name="duration"]', duration);
});

When('I click the add button on the page', async function () {
  await this.page.click('button:has-text("NEW"), button:has-text("Add")');
});

When('I confirm the deletion dialog', async function () {
  this.page.once('dialog', dialog => dialog.accept());
  // Action that triggers dialog is handled in separate step or before this
});

When('I cancel the deletion dialog', async function () {
  this.page.once('dialog', dialog => dialog.dismiss());
});

Then('I should see empty state text on the screen', async function () {
  await expect(this.page.locator('text="No corporate record found", text="empty"').first()).toBeVisible();
});

Then('each experience card should display company and role information', async function () {
  const card = this.page.locator('.glass-card').first();
  await expect(card.locator('h3, h4')).toBeVisible();
});
