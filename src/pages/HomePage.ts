import { Page, Locator } from '@playwright/test';

export class HomePage {
  constructor(
    readonly page: Page,
    readonly loginAsUserButton: Locator = page.getByRole('button', { name: 'Войти как пользователь' }),
    readonly loginAsAdminButton: Locator = page.getByRole('button', { name: 'Войти как администратор' })
  ) {}

  async loginAsUser() {
    await this.loginAsUserButton.waitFor({ timeout: 10000 });
    await this.loginAsUserButton.click();
  }

  async loginAsAdmin() {
    await this.loginAsAdminButton.waitFor({ timeout: 10000 });
    await this.loginAsAdminButton.click();
  }
}