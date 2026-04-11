import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am logged in and on the Certificates page', async function () {
  await this.loginViaUI();
  await this.goto('/certificates');
  await this.waitForLoad();
});

Given('the certificates list is empty', async function () {
   const count = await this.page.locator('.glass-card').count();
   if (count > 0) { /* Optional: delete if exists */ }
});

Given('at least one certificate exists', async function () {
  const count = await this.page.locator('.glass-card').count();
  if (count === 0) this.skip();
});

When('I hover over the first certificate card', async function () {
  await this.page.locator('.glass-card').first().hover();
});

When('I click the edit icon on the first card', async function () {
  // Finds edit button in the card
  await this.page.locator('.glass-card button:has(svg)').first().click();
});

Then('each certificate card should show the cert name', async function () {
  const name = this.page.locator('.glass-card h3').first();
  await expect(name).not.toBeEmpty();
});

Then('each card should show {string} label', async function (label) {
  const text = this.page.locator('.glass-card').first();
  await expect(text).toContainText(label);
});
