import { Page, expect } from '@playwright/test';

export class ApplicationStatusPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

async verifySuccessfulSubmission() {
  await expect(this.page.getByText('Спасибо за обращение!')).toBeVisible({ timeout: 10000 });
}
}