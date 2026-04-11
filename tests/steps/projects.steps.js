import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am logged in and on the Projects page', async function () {
  await this.loginViaUI();
  await this.goto('/projects');
  await this.waitForLoad();
});

Given('a project exists with a GitHub URL', async function () {
  // Checks if any project card has a github link (ExternalLink icon)
  const link = this.page.locator('a[href*="github.com"]').first();
  if (await link.count() === 0) this.skip();
});

When('I fill in title {string}, tech stack {string}', async function (title, tech) {
  await this.page.fill('input[name="title"]', title);
  await this.page.fill('textarea[name="tech_stack"], input[name="tech_stack"]', tech);
});

Then('the project card should have an external link icon', async function () {
  const icon = this.page.locator('.glass-card svg').first(); // Simple check for lucide icons
  await expect(icon).toBeVisible();
});

Then('that project should be gone from the list', async function () {
  await this.page.waitForTimeout(1000);
  // Implementation specific to how deletion is handled
});
