import { Page } from '@playwright/test';

export class ServiceDataPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillMarriageData(data: any) {
    await this.page.getByRole('textbox', { name: 'Дата регистрации *' }).fill(data.registrationDate);
    await this.page.getByRole('textbox', { name: 'Новая фамилия' }).fill(data.newLastName);
    await this.page.getByRole('textbox', { name: 'Фамилия супруга/и *' }).fill(data.spouseLastName);
    await this.page.getByRole('textbox', { name: 'Имя супруга/и *' }).fill(data.spouseFirstName);
    await this.page.getByRole('textbox', { name: 'Отчество супруга/и *' }).fill(data.spouseMiddleName);
    await this.page.getByRole('textbox', { name: 'Дата рождения супруга/и' }).fill(data.spouseBirthDate);
    await this.page.getByRole('textbox', { name: 'Номер паспорта супруга/и *' }).fill(data.spousePassport);
  }

 // async fillBirthData(data: any)
 // async fillDeathData(data: any) 

  async clickComplete() {
    await this.page.getByRole('button', { name: 'Завершить' }).click();
  }
}