import { Page, Locator } from '@playwright/test';

export class ApplicantDataPage {
  constructor(
    readonly page: Page,
    readonly lastName: Locator = page.getByRole('textbox', { name: 'Фамилия *' }),
    readonly firstName: Locator = page.getByRole('textbox', { name: 'Имя *' }),
    readonly middleName: Locator = page.getByRole('textbox', { name: 'Отчество *' }),
    readonly phone: Locator = page.getByRole('textbox', { name: 'Телефон *' }),
    readonly passport: Locator = page.getByRole('textbox', { name: 'Номер паспорта *' }),
    readonly address: Locator = page.getByRole('textbox', { name: 'Адрес прописки *' }),
    readonly nextButton: Locator = page.getByRole('button', { name: 'Далее' })

  ) {}

  async fillApplicantData(data: any) {
 
  const {lastName, firstName, middleName, phone, passport, address} = data;

    await this.lastName.fill(lastName);
    await this.firstName.fill(firstName);
    await this.middleName.fill(middleName);
    await this.phone.fill(phone);
    await this.passport.fill(passport);
    await this.address.fill(address);
  }

  async clickNext() {
    await this.nextButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}