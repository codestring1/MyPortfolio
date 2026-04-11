// World file — shared helpers available in all step definitions

import { setWorldConstructor, World } from '@cucumber/cucumber';

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.baseUrl = 'http://localhost:3000';
    this.testEmail = process.env.TEST_EMAIL || 'testuser@example.com';
    this.testPassword = process.env.TEST_PASSWORD || 'TestPass123!';
  }

  // Helper: navigate to a route
  async goto(path) {
    await this.page.goto(`${this.baseUrl}${path}`);
  }

  // Helper: wait for navigation to settle
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  // Helper: login programmatically (faster than clicking through UI)
  async loginViaUI() {
    await this.goto('/login');
    await this.page.fill('input[type="email"]', this.testEmail);
    await this.page.fill('input[type="password"]', this.testPassword);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('**/');
    await this.waitForLoad();
  }
}

setWorldConstructor(CustomWorld);
