import { Page, Locator, Browser } from '@playwright/test';

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
static async openAsUser(browser: Browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    const homePage = new HomePage(page);
    await homePage.loginAsUser();

    return { context, page };
  }

  static async openAsAdmin(browser: Browser) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    const homePage = new HomePage(page);
    await homePage.loginAsAdmin();

    return { context, page };
  }
}