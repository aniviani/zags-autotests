import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ApplicantDataPage } from '../pages/ApplicantDataPage';
import { ServiceSelectionPage } from '../pages/ServiceSelectionPage';
import { CitizenDataPage } from '../pages/CitizenDataPage';
import { ServiceDataPage } from '../pages/ServiceDataPage';
import { ApplicationStatusPage } from '../pages/ApplicationStatusPage';
import { testData } from '../config/testData';

test.describe('Marriage Registration', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');
  });

  test('TC-01: Successful marriage registration', async ({ page }) => {
    const homePage = new HomePage(page);
    const applicantPage = new ApplicantDataPage(page);
    const servicePage = new ServiceSelectionPage(page);
    const citizenPage = new CitizenDataPage(page);
    const serviceDataPage = new ServiceDataPage(page);
    const statusPage = new ApplicationStatusPage(page);

    await homePage.loginAsUser();
    await applicantPage.fillApplicantData(testData.applicant);
    await applicantPage.clickNext();
    await servicePage.selectMarriageRegistration();
    await citizenPage.fillCitizenData(testData.citizen);
    await citizenPage.clickNext();
    await serviceDataPage.fillMarriageData(testData.marriageService);
    await serviceDataPage.clickComplete();
    await statusPage.verifySuccessfulSubmission();
  });
});