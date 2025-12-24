import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { ApplicantDataPage } from '../pages/ApplicantDataPage';
import { ServiceSelectionPage } from '../pages/ServiceSelectionPage';
import { CitizenDataPage } from '../pages/CitizenDataPage';
import { ServiceDataPage } from '../pages/ServiceDataPage';
import { ApplicationStatusPage } from '../pages/ApplicationStatusPage';
import { testData } from '../config/testData';
import { getApiValue } from '../helpers/network';


const registrationScenarios = [
  {
    title: 'Успешная регистрация брака',
    selectService: (servicePage: ServiceSelectionPage) =>
      servicePage.selectMarriageRegistration(),
    citizenData: testData.citizen,
    fillServiceData: (serviceDataPage: ServiceDataPage) =>
      serviceDataPage.fillMarriageData(testData.marriageService),
  },
  {
    title: 'Успешная регистрация рождения',
    selectService: (servicePage: ServiceSelectionPage) =>
      servicePage.selectBirthRegistration(),
    citizenData: testData.citizen,
    fillServiceData: (serviceDataPage: ServiceDataPage) =>
      serviceDataPage.fillBirthData(testData.birthService),
  },
  {
    title: 'Успешная регистрация смерти',
    selectService: (servicePage: ServiceSelectionPage) =>
      servicePage.selectDeathRegistration(),
    citizenData: testData.citizenDeath,
    fillServiceData: (serviceDataPage: ServiceDataPage) =>
      serviceDataPage.fillDeathData(testData.deathService),
  },
];

test.describe('Тесты регистрации пользователей', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    await new HomePage(page).loginAsUser();
  });

  for (const scenario of registrationScenarios) {
    test(`TC: ${scenario.title}`, async ({ page }) => {
      const applicantPage = new ApplicantDataPage(page);
      const servicePage = new ServiceSelectionPage(page);
      const citizenPage = new CitizenDataPage(page);
      const serviceDataPage = new ServiceDataPage(page);
      const statusPage = new ApplicationStatusPage(page);

      const apiApplicationIdPromise = getApiValue({
        page,
        requestName: 'sendUserRequest',
        key: 'applicationid',
      });

      await applicantPage.fillApplicantData(testData.applicant);
      await applicantPage.clickNext();

      await scenario.selectService(servicePage);

      await citizenPage.fillCitizenData(scenario.citizenData);
      await citizenPage.clickNext();

      await scenario.fillServiceData(serviceDataPage);
      await serviceDataPage.clickComplete();

      const uiRequestNumber = await statusPage.getRequestNumber();
      const apiRequestNumber = await apiApplicationIdPromise;

      expect(uiRequestNumber,'Номер заявки в UI должен совпадать с API').toBe(apiRequestNumber);

      expect(Number(uiRequestNumber),'Номер заявки должен быть больше 0').toBeGreaterThan(0);
    });
  }
});
