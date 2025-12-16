import { Page, Locator, expect } from '@playwright/test';

export class AdminDashboardPage {
  constructor(
    readonly page: Page,

    readonly table: Locator = page.locator('.MuiTableContainer-root'),

    readonly tableCells: Locator = page.getByRole('cell'),

    readonly approveButton: Locator = page.getByRole('button').first(),
    readonly rejectButton: Locator = page.getByRole('button').nth(1)
  ) {}

  async waitTable() {
    await expect(this.table).toBeVisible({ timeout: 20000 });
  }

  async shouldHaveApplicationWithNumber(requestNumber: string) {
    const requestCell = this.tableCells.filter({
      hasText: new RegExp(requestNumber),
    });

    await expect(
      requestCell.first(),
      `Заявка с номером ${requestNumber} не появилась в таблице администратора`
    ).toBeVisible({ timeout: 20000 });
  }

  async shouldHaveService(serviceName: RegExp) {
    await expect(
      this.tableCells.filter({ hasText: serviceName }).first()
    ).toBeVisible({ timeout: 20000 });
  }

  async shouldHaveStatus(status: RegExp) {
    await expect(
      this.tableCells.filter({ hasText: status }).first()
    ).toBeVisible({ timeout: 20000 });
  }

  async approveApplication() {
    await this.approveButton.click();
  }

  async rejectApplication() {
    await this.rejectButton.click();
  }

  async shouldBeApproved() {
    await this.shouldHaveStatus(/Одобрена/i);
  }

  async shouldBeRejected() {
    await this.shouldHaveStatus(/Отклонена/i);
  }
}
