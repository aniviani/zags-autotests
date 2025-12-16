import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

import { ApplicantDataPage } from '../pages/ApplicantDataPage';
import { ServiceSelectionPage } from '../pages/ServiceSelectionPage';
import { CitizenDataPage } from '../pages/CitizenDataPage';
import { ServiceDataPage } from '../pages/ServiceDataPage';
import { ApplicationStatusPage } from '../pages/ApplicationStatusPage';

import { testData } from '../config/testData';

test('TC-05: Новая заявка отображается у администратора после регистрации пользователем', async ({ browser }) => {

  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();

  await adminPage.goto(process.env.BASE_URL as string);
  await adminPage.waitForLoadState('networkidle');

  const homeAdmin = new HomePage(adminPage);
  const adminLogin = new AdminLoginPage(adminPage);
  const adminDashboard = new AdminDashboardPage(adminPage);

  await homeAdmin.loginAsAdmin();
  await adminLogin.submitAdminLogin(testData.admin);
  await adminDashboard.waitTable();

  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();

  await userPage.goto(process.env.BASE_URL as string);
  await userPage.waitForLoadState('networkidle');

  const homeUser = new HomePage(userPage);
  const applicantPage = new ApplicantDataPage(userPage);
  const serviceSelection = new ServiceSelectionPage(userPage);
  const citizenPage = new CitizenDataPage(userPage);
  const serviceDataPage = new ServiceDataPage(userPage);
  const statusPage = new ApplicationStatusPage(userPage);

  await homeUser.loginAsUser();

  await applicantPage.fillApplicantData(testData.applicant);
  await applicantPage.clickNext();

  await serviceSelection.selectMarriageRegistration();

  await citizenPage.fillCitizenData(testData.citizen);
  await citizenPage.clickNext();

  await serviceDataPage.fillMarriageData(testData.marriageService);
  await serviceDataPage.clickComplete();

  const requestNumber = await statusPage.getRequestNumber();
  expect(Number(requestNumber)).toBeGreaterThan(0);

  await adminContext.close();

  const adminContext2 = await browser.newContext();
  const adminPage2 = await adminContext2.newPage();

  await adminPage2.goto(process.env.BASE_URL as string);
  await adminPage2.waitForLoadState('networkidle');

  const homeAdmin2 = new HomePage(adminPage2);
  const adminLogin2 = new AdminLoginPage(adminPage2);
  const adminDashboard2 = new AdminDashboardPage(adminPage2);

  await homeAdmin2.loginAsAdmin();
  await adminLogin2.submitAdminLogin(testData.admin);
  await adminDashboard2.waitTable();

  await adminDashboard2.shouldHaveApplicationWithNumber(requestNumber);

  await userContext.close();
  await adminContext2.close();
});
