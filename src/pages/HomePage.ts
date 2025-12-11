import { Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginAsUser() {
    await this.page.getByRole('button', { name: 'Войти как пользователь' }).waitFor({ timeout: 10000 });
    await this.page.getByRole('button', { name: 'Войти как пользователь' }).click();
  }

  async loginAsAdmin() {
    await this.page.getByRole('button', { name: 'Войти как администратор' }).click();
  }
}