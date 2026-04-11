import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am logged in and on the Academics page', async function () {
  await this.loginViaUI();
  await this.goto('/academics');
  await this.waitForLoad();
});

When('I enter institution {string}', async function (name) {
  await this.page.fill('input[name="institution"], input[placeholder*="Institution"]', name);
});

When('I enter degree {string} and branch {string}', async function (degree, branch) {
  await this.page.fill('input[name="degree"]', degree);
  await this.page.fill('input[name="branch"]', branch);
});

Then('the page should have distinct sections for:', async function (dataTable) {
  for (const row of dataTable.raw()) {
    await expect(this.page.locator(`text="${row[0]}"`)).toBeVisible();
  }
});
