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

test.describe('User Registration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    homePage = new HomePage(page);
    applicantPage = new ApplicantDataPage(page);
    servicePage = new ServiceSelectionPage(page);
    citizenPage = new CitizenDataPage(page);
    serviceDataPage = new ServiceDataPage(page);
    statusPage = new ApplicationStatusPage(page);

    await homePage.loginAsUser();
  });

  test('TC-01: Успешная регистрация брака', async ({ page }) => {
    
    let apiApplicationId: string | null = null;
    
    page.on('response', async (response) => {
        if (
            response.url().includes('sendUserRequest') &&
            response.status() === 200
        ) {
            const data = await response.json();
            apiApplicationId = String(data.data.applicationid);
        }
    });

    await applicantPage.fillApplicantData(testData.applicant);
    await applicantPage.clickNext();

    await servicePage.selectMarriageRegistration();

    await citizenPage.fillCitizenData(testData.citizen);
    await citizenPage.clickNext();

    await serviceDataPage.fillMarriageData(testData.marriageService);
    await serviceDataPage.clickComplete();
    
    const requestNumber = await statusPage.getRequestNumber();
    
    expect(apiApplicationId, 'Номер заявки не получен из API').not.toBeNull();
    expect(requestNumber, 'Номер заявки в UI должен совпадать с API').toBe(apiApplicationId!);
    
    expect(Number(requestNumber), 'Номер заявки должен быть больше 0 (данные с сервера получены)').toBeGreaterThan(0);
});

  test('TC-02: Успешная регистрация рождения', async () => {
    await applicantPage.fillApplicantData(testData.applicant);
    await applicantPage.clickNext();

    await servicePage.selectBirthRegistration();

    await citizenPage.fillCitizenData(testData.citizen);
    await citizenPage.clickNext();

    await serviceDataPage.fillBirthData(testData.birthService);
    await serviceDataPage.clickComplete();

    const requestNumber = await statusPage.getRequestNumber();
    expect(Number(requestNumber), 'Номер заявки должен быть больше 0 (данные с сервера получены)').toBeGreaterThan(0);
  });

  test('TC-03: Успешная регистрация смерти', async () => {
    await applicantPage.fillApplicantData(testData.applicant);
    await applicantPage.clickNext();

    await servicePage.selectDeathRegistration();

    await citizenPage.fillCitizenData(testData.citizenDeath);
    await citizenPage.clickNext();

    await serviceDataPage.fillDeathData(testData.deathService);
    await serviceDataPage.clickComplete();

    const requestNumber = await statusPage.getRequestNumber();
    expect(Number(requestNumber), 'Номер заявки должен быть больше 0 (данные с сервера получены)').toBeGreaterThan(0);
  });
});