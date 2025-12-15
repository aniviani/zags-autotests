import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ApplicantDataPage } from '../pages/ApplicantDataPage';
import { ServiceSelectionPage } from '../pages/ServiceSelectionPage';
import { CitizenDataPage } from '../pages/CitizenDataPage';
import { ServiceDataPage } from '../pages/ServiceDataPage';
import { ApplicationStatusPage } from '../pages/ApplicationStatusPage';
import { testData } from '../config/testData';

let homePage: HomePage;
let applicantPage: ApplicantDataPage;
let servicePage: ServiceSelectionPage;
let citizenPage: CitizenDataPage;
let serviceDataPage: ServiceDataPage;
let statusPage: ApplicationStatusPage;

test.describe('Death Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    homePage = new HomePage(page);
    applicantPage = new ApplicantDataPage(page);
    servicePage = new ServiceSelectionPage(page);
    citizenPage = new CitizenDataPage(page);
    serviceDataPage = new ServiceDataPage(page);
    statusPage = new ApplicationStatusPage(page);
  });

  test('TC-03: Successful death registration (user)', async () => {
    await homePage.loginAsUser();

    await applicantPage.fillApplicantData(testData.applicant);
    await applicantPage.clickNext();

    await servicePage.selectDeathRegistration();

    await citizenPage.fillCitizenData(testData.citizenDeath);
    await citizenPage.clickNext();

    await serviceDataPage.fillDeathData(testData.deathService);
    await serviceDataPage.clickComplete();

    await statusPage.verifySuccessfulSubmission();
    await statusPage.verifyStatusPageUI();
  });
});
