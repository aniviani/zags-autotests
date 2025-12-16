import { test, expect } from '@playwright/test';

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

test.describe('Birth Registration', () => {
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

  test('TC-02: Successful birth registration (user)', async () => {
    await homePage.loginAsUser();

    await applicantPage.fillApplicantData(testData.applicant);
    await applicantPage.clickNext();

    await servicePage.selectBirthRegistration();

    await citizenPage.fillCitizenData(testData.citizen);
    await citizenPage.clickNext();

    await serviceDataPage.fillBirthData(testData.birthService);
    await serviceDataPage.clickComplete();

    const requestNumber = await statusPage.getRequestNumber();
    expect(Number(requestNumber)).toBeGreaterThan(0);

    expect(await statusPage.isUnderReviewStatusVisible()).toBe(true);
    expect(await statusPage.isRegistrationDateVisible()).toBe(true);
  });
});
