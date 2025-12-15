import { Page, Locator } from '@playwright/test';

export class ServiceSelectionPage {
  constructor(
    readonly page: Page,
    readonly marriageRegistrationButton: Locator = page.getByRole('button', { name: 'Регистрация брака' }),
    readonly birthRegistrationButton: Locator = page.getByRole('button', { name: 'Регистрация рождения' }),
    readonly deathRegistrationButton: Locator = page.getByRole('button', { name: 'Регистрация смерти' })
  ) {}

  async selectMarriageRegistration() {
    await this.marriageRegistrationButton.click();
    await this.page.waitForLoadState('networkidle');
  }
  
  async selectBirthRegistration() {
    await this.birthRegistrationButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async selectDeathRegistration() {
    await this.deathRegistrationButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}