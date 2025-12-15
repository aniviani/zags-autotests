import { Page, Locator } from '@playwright/test';

export class ServiceDataPage {
  constructor(
    readonly page: Page,

    // Marriage locators
    readonly registrationDate: Locator = page.getByRole('textbox', { name: /Дата регистрации/i  }),
    readonly newLastName: Locator = page.getByRole('textbox', { name: /Новая фамилия/i }),
    readonly spouseLastName: Locator = page.getByRole('textbox', { name: /Фамилия супруга/i }),
    readonly spouseFirstName: Locator = page.getByRole('textbox', { name: /Имя супруга/i }),
    readonly spouseMiddleName: Locator = page.getByRole('textbox', { name: /Отчество супруга/i }),
    readonly spouseBirthDate: Locator = page.getByRole('textbox', { name: /Дата рождения супруга/i }),
    readonly spousePassport: Locator = page.getByRole('textbox', { name: /Номер паспорта супруга/i }),
    
    // Birth locators
    readonly birthPlace: Locator = page.getByRole('textbox', { name: /Место рождения/i }),
    readonly mother: Locator = page.getByRole('textbox', { name: /Мать/i }),
    readonly father: Locator = page.getByRole('textbox', { name: /Отец/i }),
    readonly grandmother: Locator = page.getByRole('textbox', { name: /Бабушка/i }),
    readonly grandfather: Locator = page.getByRole('textbox', { name: /Дедушка/i }),
  
    // Death locators
    readonly deathDate: Locator = page.getByRole('textbox', { name: /Дата смерти/i }),
    readonly deathPlace: Locator = page.getByRole('textbox', { name: /Место смерти/i }),

    readonly completeButton: Locator = page.getByRole('button', { name: 'Завершить' })
  ) {}


  async fillMarriageData(data: any) {
    const {
      registrationDate,
      newLastName,
      spouseLastName,
      spouseFirstName,
      spouseMiddleName,
      spouseBirthDate,
      spousePassport,
    } = data;

    await this.registrationDate.fill(registrationDate);
    await this.newLastName.fill(newLastName);
    await this.spouseLastName.fill(spouseLastName);
    await this.spouseFirstName.fill(spouseFirstName);
    await this.spouseMiddleName.fill(spouseMiddleName);
    await this.spouseBirthDate.fill(spouseBirthDate);
    await this.spousePassport.fill(spousePassport);
  }

   async fillBirthData(data: any) {
    const { birthPlace, mother, father, grandmother, grandfather } = data;

    await this.birthPlace.fill(birthPlace);
    await this.mother.fill(mother);
    await this.father.fill(father);
    await this.grandmother.fill(grandmother);
    await this.grandfather.fill(grandfather);
  }

  async fillDeathData(data: any) {
    const { deathDate, deathPlace } = data;

    await this.deathDate.fill(deathDate);
    await this.deathPlace.fill(deathPlace);
  }

  async clickComplete() {
    await this.completeButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}