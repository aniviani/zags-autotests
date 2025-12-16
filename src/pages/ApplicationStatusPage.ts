import { Page, Locator, expect } from '@playwright/test';

export class ApplicationStatusPage {
  constructor(
    readonly page: Page,

    readonly requestNumber: Locator = page.getByText(/№\s*\d+/),

    readonly statusUnderReview: Locator = page.getByText(/Статус заявки:\s*На рассмотрении/i),
    readonly registrationDateLabel: Locator = page.getByText(/Дата регистрации заявки/i),

    readonly refreshButton: Locator = page.getByRole('button', { name: 'Обновить' }),
    readonly newRequestButton: Locator = page.getByRole('button', { name: 'Создать новую заявку' }),
    readonly closeButton: Locator = page.getByRole('button', { name: 'Закрыть' })
  ) {}

  async getRequestNumber(): Promise<string> {
    await expect(this.requestNumber.first()).toBeVisible({ timeout: 10000 });

    const raw = (await this.requestNumber.first().textContent()) ?? '';
    const match = raw.match(/\d+/);

    expect(match, `Не удалось извлечь номер заявки из текста: "${raw}"`).not.toBeNull();

    return match![0];
  }

  async refreshStatus() {
    await this.refreshButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async startNewRequest() {
    await this.newRequestButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async closeStatusPage() {
    await this.closeButton.click();
  }

  async isUnderReviewStatusVisible(): Promise<boolean> {
    return this.statusUnderReview.isVisible();
  }

  async isRegistrationDateVisible(): Promise<boolean> {
    return this.registrationDateLabel.isVisible();
  }
}

