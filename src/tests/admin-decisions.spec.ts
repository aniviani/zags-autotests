import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { testData } from '../config/testData';

let homePage: HomePage;
let adminLoginPage: AdminLoginPage;
let dashboard: AdminDashboardPage;

test.describe('Admin decisions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    homePage = new HomePage(page);
    adminLoginPage = new AdminLoginPage(page);
    dashboard = new AdminDashboardPage(page);

    await homePage.loginAsAdmin();
    await adminLoginPage.submitAdminLogin(testData.admin);
    await dashboard.waitTable();
  });

  test('TC-06: Одобрение заявки на регистрацию брака', async () => {
    await dashboard.shouldHaveService(/Получение свидетельства о браке/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.approveApplication();
    await dashboard.shouldBeApproved();
  });

  test('TC-07: Отказ по заявке на регистрацию брака', async () => {
    await dashboard.shouldHaveService(/Получение свидетельства о браке/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.rejectApplication();
    await dashboard.shouldBeRejected();
  });

  test('TC-08: Одобрение заявки на регистрацию рождения', async () => {
    await dashboard.shouldHaveService(/Получение свидетельства о рождении/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.approveApplication();
    await dashboard.shouldBeApproved();
  });

  test('TC-09: Отказ по заявке на регистрацию рождения', async () => {
    await dashboard.shouldHaveService(/Получение свидетельства о рождении/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.rejectApplication();
    await dashboard.shouldBeRejected();
  });

  test('TC-10: Одобрение заявки на регистрацию смерти', async () => {
    await dashboard.shouldHaveService(/Получение свидетельства о смерти/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.approveApplication();
    await dashboard.shouldBeApproved();
  });

  test('TC-11: Отказ по заявке на регистрацию смерти', async () => {
    await dashboard.shouldHaveService(/Получение свидетельства о смерти/i);
    await dashboard.shouldHaveStatus(/На рассмотрении/i);

    await dashboard.rejectApplication();
    await dashboard.shouldBeRejected();
  });
});
