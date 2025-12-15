import { Page, Locator } from '@playwright/test';

export class CitizenDataPage {
  constructor(
    readonly page: Page,
    readonly lastName: Locator = page.getByRole('textbox', { name: 'Фамилия *' }),
    readonly firstName: Locator = page.getByRole('textbox', { name: 'Имя *' }),
    readonly middleName: Locator = page.getByRole('textbox', { name: 'Отчество *' }),
    readonly birthDate: Locator = page.getByRole('textbox', { name: 'Дата рождения *' }),
    readonly passport: Locator = page.getByRole('textbox', { name: 'Номер паспорта' }),
    readonly gender: Locator = page.getByRole('textbox', { name: 'Пол *' }),
    readonly address: Locator = page.getByRole('textbox', { name: 'Адрес прописки *' }),
    readonly nextButton: Locator = page.getByRole('button', { name: 'Далее' })
  ) {}

  async fillCitizenData(data: any) {
    
    const { lastName, firstName, middleName, birthDate, passport, gender, address } = data;

    await this.lastName.fill(lastName);
    await this.firstName.fill(firstName);
    await this.middleName.fill(middleName);
    await this.birthDate.fill(birthDate);

    if (passport) {
      await this.passport.fill(passport);
    }

    await this.gender.fill(gender);
    await this.address.fill(address);
  }

  async clickNext() {
    await this.nextButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}