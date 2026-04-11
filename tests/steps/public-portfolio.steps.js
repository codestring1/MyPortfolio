import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('a user with username {string} exists', async function (username) {
  // Mock or ensure data exists
});

When('I navigate to {string}', async function (path) {
  await this.goto(path);
  await this.waitForLoad();
});

Then('I should see their name and public profile details', async function () {
  await expect(this.page.locator('h1, .profile-name')).toBeVisible();
});

Then('I should see a Skills section with their listed skills', async function () {
  await expect(this.page.locator('text="Skills", text="Capability"').first()).toBeVisible();
});
