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

  async getRequestNumber(): Promise<number> {
    await expect(this.requestNumber.first()).toBeVisible({ timeout: 10000 });

    const raw = (await this.requestNumber.first().textContent()) ?? '';
    const match = raw.match(/\d+/);

    expect(match, `Не удалось извлечь номер заявки из текста: "${raw}"`).not.toBeNull();

    return Number(match![0]);
  }

  async verifySuccessfulSubmission() {
    const number = await this.getRequestNumber();
    expect(number, `Номер заявки некорректный: ${number}`).toBeGreaterThan(0);
  }

  async verifyStatusPageUI() {
    await expect(this.statusUnderReview).toBeVisible({ timeout: 10000 });
    await expect(this.registrationDateLabel).toBeVisible({ timeout: 10000 });

    await expect(this.refreshButton).toBeVisible();
    await expect(this.newRequestButton).toBeVisible();
    await expect(this.closeButton).toBeVisible();
  }
}
