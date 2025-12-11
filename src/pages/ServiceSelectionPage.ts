import { Page } from '@playwright/test';

export class ServiceSelectionPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selectMarriageRegistration() {
    await this.page.getByRole('button', { name: 'Регистрация брака' }).click();
  }

 // async selectBirthRegistration() 
 // async selectDeathRegistration() 
}