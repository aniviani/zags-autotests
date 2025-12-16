import { test, expect } from '@playwright/test';

import { HomePage } from '../pages/HomePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { testData } from '../config/testData';

let homePage: HomePage;
let adminLoginPage: AdminLoginPage;
let adminDashboardPage: AdminDashboardPage;

test.describe('Admin login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    homePage = new HomePage(page);
    adminLoginPage = new AdminLoginPage(page);
    adminDashboardPage = new AdminDashboardPage(page);
  });

  test('TC-04: Admin successfully logs in and sees applications table', async () => {

    await homePage.loginAsAdmin();
    await adminLoginPage.submitAdminLogin(testData.admin);

    await adminDashboardPage.waitTable();
    await expect(adminDashboardPage.table).toBeVisible();
  });
});
