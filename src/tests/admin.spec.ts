import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ApplicantDataPage } from '../pages/ApplicantDataPage';

import { testData } from '../config/testData';

let homePage: HomePage;
let adminLoginPage: AdminLoginPage;
let dashboard: AdminDashboardPage;

test.describe('Admin Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    homePage = new HomePage(page);
    adminLoginPage = new AdminLoginPage(page);
    dashboard = new AdminDashboardPage(page);
  });

  test('TC-04: Администратор успешно входит в систему и видит таблицу приложений.', async () => {
    await homePage.loginAsAdmin();
    await adminLoginPage.submitAdminLogin(testData.admin);

    await dashboard.waitTable();
    await expect(dashboard.table).toBeVisible();
  });

  test('TC-05: Новая заявка отображается у администратора после регистрации пользователем', async ({ browser }) => {
  const admin1 = await HomePage.openAsAdmin(browser);
  const adminLogin1 = new AdminLoginPage(admin1.page);
  await adminLogin1.loginAndWaitDashboard(testData.admin);
  await admin1.context.close();

  const user = await HomePage.openAsUser(browser);
  const applicantPage = new ApplicantDataPage(user.page);
  const requestNumber = await applicantPage.completeMarriageApplication({
    applicant: testData.applicant,
    citizen: testData.citizen,
    marriageService: testData.marriageService
  });

  expect(Number(requestNumber), 'Номер заявки должен быть больше 0').toBeGreaterThan(0);
  await user.context.close();

  const admin2 = await HomePage.openAsAdmin(browser);
  const adminLogin2 = new AdminLoginPage(admin2.page);
  const dashboard = await adminLogin2.loginAndWaitDashboard(testData.admin);
  await dashboard.shouldHaveApplicationWithNumber(requestNumber);
  await admin2.context.close();
});

  test.describe('Admin decisions', () => {
    test.beforeEach(async () => {
      await homePage.loginAsAdmin();
      await adminLoginPage.submitAdminLogin(testData.admin);
      await dashboard.waitTable();
    });

  test('TC-06: Одобрение заявки на регистрацию брака', async () => {

    await dashboard.shouldHaveService(/Получение свидетельства о браке/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.performAction('approve');
    await dashboard.checkStatus('approved');
  });

  test('TC-07: Отказ по заявке на регистрацию брака', async () => {

    await dashboard.shouldHaveService(/Получение свидетельства о браке/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.performAction('reject');
    await dashboard.checkStatus('rejected');
  });

  test('TC-08: Одобрение заявки на регистрацию рождения', async () => {

    await dashboard.shouldHaveService(/Получение свидетельства о рождении/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

   await dashboard.performAction('approve');
   await dashboard.checkStatus('approved');
  });

  test('TC-09: Отказ по заявке на регистрацию рождения', async () => {

    await dashboard.shouldHaveService(/Получение свидетельства о рождении/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.performAction('reject');
    await dashboard.checkStatus('rejected');
  });

  test('TC-10: Одобрение заявки на регистрацию смерти', async () => {
 
    await dashboard.shouldHaveService(/Получение свидетельства о смерти/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.performAction('approve');
    await dashboard.checkStatus('approved');
  });

  test('TC-11: Отказ по заявке на регистрацию смерти', async () => {

    await dashboard.shouldHaveService(/Получение свидетельства о смерти/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.performAction('reject');
    await dashboard.checkStatus('rejected');
  });
});
});