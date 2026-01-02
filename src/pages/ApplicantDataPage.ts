import { Page, Locator } from '@playwright/test';
import { ServiceSelectionPage } from './ServiceSelectionPage';
import { CitizenDataPage } from './CitizenDataPage';
import { ServiceDataPage } from './ServiceDataPage';
import { ApplicationStatusPage } from './ApplicationStatusPage';

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

   async completeMarriageApplication(data: {
    applicant: any;
    citizen: any;
    marriageService: any;
  }): Promise<string> {
    const servicePage = new ServiceSelectionPage(this.page);
    const citizenPage = new CitizenDataPage(this.page);
    const serviceDataPage = new ServiceDataPage(this.page);
    const statusPage = new ApplicationStatusPage(this.page);

    await this.fillApplicantData(data.applicant);
    await this.clickNext();

    await servicePage.selectMarriageRegistration();

    await citizenPage.fillCitizenData(data.citizen);
    await citizenPage.clickNext();

    await serviceDataPage.fillMarriageData(data.marriageService);
    await serviceDataPage.clickComplete();

    return await statusPage.getRequestNumber();
  }
}