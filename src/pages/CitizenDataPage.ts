import { Page } from '@playwright/test';

export class CitizenDataPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillCitizenData(data: any) {
 
    await this.page.getByRole('textbox', { name: 'Фамилия *' }).fill(data.lastName);
    await this.page.getByRole('textbox', { name: 'Имя *' }).fill(data.firstName);
    await this.page.getByRole('textbox', { name: 'Отчество *' }).fill(data.middleName);
    await this.page.getByRole('textbox', { name: 'Дата рождения *' }).fill(data.birthDate);
    
    if (data.passport) {
      await this.page.getByRole('textbox', { name: 'Номер паспорта' }).fill(data.passport);
    }

    await this.page.getByRole('textbox', { name: 'Пол *' }).fill(data.gender);
    await this.page.getByRole('textbox', { name: 'Адрес прописки *' }).fill(data.address);
  }

  async clickNext() {
    await this.page.getByRole('button', { name: 'Далее' }).click();
    await this.page.waitForLoadState('networkidle');
  }
}