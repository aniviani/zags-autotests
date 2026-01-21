import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ApplicantDataPage } from '../pages/ApplicantDataPage';
import { ServiceSelectionPage } from '../pages/ServiceSelectionPage';
import { CitizenDataPage } from '../pages/CitizenDataPage';
import { ServiceDataPage } from '../pages/ServiceDataPage';
import { ApplicationStatusPage } from '../pages/ApplicationStatusPage';
import { testData } from '../config/testData';
import { getApiValue } from '../helpers/network';
import { getDbValue } from '../helpers/db';
import { registrationScenarios } from '../scenarios/registration.scenarios';

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
      
      const dbKind = await getDbValue({
        query: 
        `SELECT kindofapplication
        FROM reg_office.applications
        WHERE applicationid = $1`,
        params: [uiRequestNumber],
        field: 'kindofapplication',
      });
      
      expect(dbKind,'Тип заявки в БД должен соответствовать выбранному сервису').toBe(scenario.expectedDbKind);
      
      const dbStatus = await getDbValue({
        query: 
        `SELECT statusofapplication
        FROM reg_office.applications
        WHERE applicationid = $1`,
        params: [uiRequestNumber],
        field: 'statusofapplication',
      });
      
      expect(dbStatus,'Статус новой заявки в БД должен быть under consideration').toBe('under consideration');
    });
  }
});
