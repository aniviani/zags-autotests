import { Page, Locator } from '@playwright/test';
import { AdminDashboardPage } from './AdminDashboardPage';

export class AdminLoginPage {
  constructor(
    readonly page: Page,

    readonly lastName: Locator = page.getByRole('textbox', { name: /Фамилия/i }),
    readonly firstName: Locator = page.getByRole('textbox', { name: /Имя/i }),
    readonly middleName: Locator = page.getByRole('textbox', { name: /Отчество/i }),
    readonly phone: Locator = page.getByRole('textbox', { name: /Телефон/i }),
    readonly passport: Locator = page.getByRole('textbox', { name: /Номер паспорта/i }),
    readonly birthDate: Locator = page.getByRole('textbox', { name: /Дата рождения/i }),

    readonly submitButton: Locator = page.getByRole('button', { name: /Далее/i })
  ) {}

  async submitAdminLogin(data: any) {
    const { lastName, firstName, middleName, phone, passport, birthDate } = data;

    await this.lastName.fill(lastName);
    await this.firstName.fill(firstName);
    await this.middleName.fill(middleName);
    await this.phone.fill(phone);
    await this.passport.fill(passport);
    await this.birthDate.fill(birthDate);

    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async loginAndWaitDashboard(data: any) {
    await this.submitAdminLogin(data);
    
    const adminDashboard = new AdminDashboardPage(this.page);
    await adminDashboard.waitTable();
    
    return adminDashboard;
  }
}
