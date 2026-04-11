import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

When('I navigate to the Chat section', async function () {
  await this.goto('/social/chat');
  await this.waitForLoad();
});

Then('I should see a list of my active conversations', async function () {
  // Check for chat list sidebar or cards
  await expect(this.page.locator('.chat-list, [class*="ChatList"]')).toBeVisible();
});

When('I type {string} in the message box', async function (message) {
  const input = this.page.locator('input[placeholder*="Type"], textarea').first();
  await input.fill(message);
});

Then('the message {string} should appear in the chat', async function (message) {
  await expect(this.page.locator(`text="${message}"`)).toBeVisible();
});
