import { Page, Locator, expect } from '@playwright/test';
import { applicationStatusMap, ApplicationStatusKey, ServiceKey, serviceMap, StatusKey, statusMap } from '../config/testData';

type AdminAction = 'approve' | 'reject';

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

    await expect(requestCell.first(),`Заявка с номером ${requestNumber} не появилась в таблице администратора`).toBeVisible({ timeout: 20000 });
  }

  async shouldHaveService(serviceName: RegExp) {
    await expect(this.tableCells.filter({ hasText: serviceName }).first()).toBeVisible({ timeout: 20000 });
  }

  async shouldHaveStatus(status: RegExp) {
    await expect(this.tableCells.filter({ hasText: status }).first()).toBeVisible({ timeout: 20000 });
  }
  
  async shouldHaveServiceByKey(service: ServiceKey) {
  const serviceRegExp = serviceMap[service];

  await this.shouldHaveService(serviceRegExp);
}

  async performAction(action: AdminAction) {
    switch (action) {
      case 'approve':
        await this.approveButton.click();
        break;
        
        case 'reject':
          await this.rejectButton.click();
          break;
          
          default:
            throw new Error(`Неизвестное действие администратора: ${action}`);
    }
  }
  
  async checkStatus(status: ApplicationStatusKey) {
  const statusConfig = applicationStatusMap[status];

  await expect(this.tableCells.filter({ hasText: statusConfig.uiText }).first(),`Статус "${status}" не отображается в таблице`).toBeVisible({ timeout: 20000 });
}
}
