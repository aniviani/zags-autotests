import { Page, Locator, expect, Request, Response, Download } from '@playwright/test';
import * as fs from 'fs';

export class ApplicationStatusPage {
  constructor(
    readonly page: Page,

    readonly requestNumber: Locator = page.getByText(/№\s*\d+/),

    readonly statusUnderReview: Locator = page.getByText(/Статус заявки:\s*На рассмотрении/i),
    readonly registrationDateLabel: Locator = page.getByText(/Дата регистрации заявки/i),

    readonly refreshButton: Locator = page.getByRole('button', { name: 'Обновить' }),
    readonly newRequestButton: Locator = page.getByRole('button', { name: 'Создать новую заявку' }),
    readonly closeButton: Locator = page.getByRole('button', { name: 'Закрыть' }),

    readonly orderCertificateButton: Locator = page.getByText('Заказать справку'),
    
    readonly lastNameInput: Locator = page.getByRole('textbox', { name: 'Фамилия *' }),
    readonly firstNameInput: Locator = page.getByRole('textbox', { name: 'Имя *' }),
    readonly emailInput: Locator = page.getByRole('textbox', { name: 'Электронная почта *' }),
    readonly applicationNumberInput: Locator = page.getByRole('spinbutton', { name: 'Номер заявки *' }),
    
    readonly submitCertificateButton: Locator = page.getByRole('button', { name: 'Отправить' }),
    readonly downloadButton: Locator = page.getByRole('button', { name: 'Cкачать' }),
 ) {}
 
 async getRequestNumber(): Promise<string> {
  await expect(this.requestNumber.first()).toBeVisible({ timeout: 10000 });
  
  const raw = (await this.requestNumber.first().textContent()) ?? '';
  const match = raw.match(/\d+/);
  
  expect(match, `Не удалось извлечь номер заявки из текста: "${raw}"`).not.toBeNull();
  return match![0];
}

async refreshStatus(): Promise<void> {
  await this.refreshButton.click();
  await this.page.waitForLoadState('networkidle');
}

async startNewRequest(): Promise<void> {
  await this.newRequestButton.click();
  await this.page.waitForLoadState('networkidle');
}

async closeStatusPage(): Promise<void> {
  await this.closeButton.click();
}

async isUnderReviewStatusVisible(): Promise<boolean> {
  return this.statusUnderReview.isVisible();
}

async isRegistrationDateVisible(): Promise<boolean> {
  return this.registrationDateLabel.isVisible();
}

async openCertificateForm(): Promise<void> {
  if (await this.closeButton.isVisible()) {
    await this.closeButton.click();
  }
  
  await expect(
    this.orderCertificateButton,
    'Кнопка "Заказать справку" должна быть доступна'
  ).toBeVisible({ timeout: 5000 });
  
  await this.orderCertificateButton.click();
  
  await expect(
    this.lastNameInput,
    'Форма заказа справки не открылась'
  ).toBeVisible({ timeout: 5000 });
}

async fillCertificateForm(
  data: { 
    lastName: string; 
    firstName: string; 
    email: string 
  },
  
  applicationNumber: string
): Promise<void> {
  await this.lastNameInput.fill(data.lastName);
  await this.firstNameInput.fill(data.firstName);
  await this.emailInput.fill(data.email);
  await this.applicationNumberInput.fill(applicationNumber);
}

async submitCertificateForm(): Promise<void> {
  await this.submitCertificateButton.click();
  await expect(
    this.downloadButton,
    'Кнопка скачивания не появилась'
  ).toBeVisible({ timeout: 10000 });
}

async downloadCertificate(): Promise<Download> {
  const downloadPromise = this.page.waitForEvent('download');
  await this.downloadButton.click();
  return downloadPromise;
}

async sendCertificateToEmail(): Promise<void> {
  await this.submitCertificateButton.click();
}

async validateDownloadedFile(download: Download): Promise<void> {
  const path = await download.path();
  expect(path, 'Файл должен быть скачан').not.toBeNull();
  
  const stats = fs.statSync(path!);
  expect(stats.size, 'Размер файла должен быть больше 0').toBeGreaterThan(0);
}
}