import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am logged in and on the Settings page', async function () {
  await this.loginViaUI();
  await this.goto('/settings');
  await this.waitForLoad();
});

When('I clear the {string} field', async function (fieldName) {
  await this.page.fill(`input[name="${fieldName.toLowerCase().replace(' ', '_')}"]`, '');
});

When('I type {string}', async function (value) {
  // Assuming this follows the previous "clear" step on the same field
  await this.page.keyboard.type(value);
});

When('I enter {string} in the GitHub field', async function (url) {
  await this.page.fill('input[name="github_link"]', url);
});

Then('I should see a success message {string}', async function (msg) {
  await expect(this.page.locator(`text="${msg}"`)).toBeVisible();
});
