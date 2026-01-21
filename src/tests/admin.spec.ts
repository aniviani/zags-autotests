import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ApplicantDataPage } from '../pages/ApplicantDataPage';
import { testData } from '../config/testData';
import { getDbValue } from '../helpers/db';

const adminDecisionScenarios = [
  { service: 'marriage', action: 'approve', expectedStatus: 'approved' },
  { service: 'marriage', action: 'reject', expectedStatus: 'rejected' },

  { service: 'birth', action: 'approve', expectedStatus: 'approved' },
  { service: 'birth', action: 'reject', expectedStatus: 'rejected' },

  { service: 'death', action: 'approve', expectedStatus: 'approved' },
  { service: 'death', action: 'reject', expectedStatus: 'rejected' },
] as const;

test.describe('Тесты администратора', () => {
  let homePage: HomePage;
  let adminLoginPage: AdminLoginPage;
  let dashboard: AdminDashboardPage;
  let applicationId: string;

  test.beforeEach(async ({ browser, page }) => {
    const user = await HomePage.openAsUser(browser);
    const applicantPage = new ApplicantDataPage(user.page);
    
    applicationId = await applicantPage.completeMarriageApplication({
      applicant: testData.applicant,
      citizen: testData.citizen,
      marriageService: testData.marriageService,
    });
    
    expect(Number(applicationId),'Номер заявки должен быть больше 0').toBeGreaterThan(0);

    await user.context.close();
    await page.goto(process.env.BASE_URL as string);
    await page.waitForLoadState('networkidle');

    homePage = new HomePage(page);
    adminLoginPage = new AdminLoginPage(page);
    dashboard = new AdminDashboardPage(page);
  });
  
  test('TC-04: Администратор успешно входит в систему и видит таблицу заявок', async () => {
    await homePage.loginAsAdmin();
    await adminLoginPage.submitAdminLogin(testData.admin);

    await dashboard.waitTable();
    await expect(dashboard.table).toBeVisible();
  });

  test.describe('Решения администратора', () => {
    test.beforeEach(async () => {
      await homePage.loginAsAdmin();
      await adminLoginPage.submitAdminLogin(testData.admin);
      await dashboard.waitTable();
    });

    for (const scenario of adminDecisionScenarios) {
      test(`Администратор ${scenario.action} ${scenario.service} → ${scenario.expectedStatus}`, async () => {
          await dashboard.shouldHaveServiceByKey(scenario.service);
          await dashboard.checkStatus('under consideration');

          await dashboard.performAction(scenario.action);
          await dashboard.checkStatus(scenario.expectedStatus);
          
          const dbStatus = await getDbValue({
            query: 
            `SELECT statusofapplication
            FROM reg_office.applications
            WHERE applicationid = $1`,
            params: [applicationId],
            field: 'statusofapplication',
          });
          
          expect(dbStatus,'Статус заявки в БД должен совпадать с решением администратора').toBe(scenario.expectedStatus);
        }
      );
    }
  });
});

test('TC-05: Новая заявка отображается у администратора после регистрации пользователем', async ({ browser }) => {
  const adminInit = await HomePage.openAsAdmin(browser);
  await new AdminLoginPage(adminInit.page).loginAndWaitDashboard(testData.admin);
  await adminInit.context.close();
  
  const user = await HomePage.openAsUser(browser);
  const applicantPage = new ApplicantDataPage(user.page);
  
  const requestNumber = await applicantPage.completeMarriageApplication({
    applicant: testData.applicant,
    citizen: testData.citizen,
    marriageService: testData.marriageService,
  });
  
  expect(Number(requestNumber), 'Номер заявки должен быть больше 0').toBeGreaterThan(0);
  
  await user.context.close();
  
  const admin = await HomePage.openAsAdmin(browser);
  const dashboard = await new AdminLoginPage(admin.page).loginAndWaitDashboard(testData.admin);
  
  await dashboard.waitTable();
  await dashboard.shouldHaveApplicationWithNumber(requestNumber);
  await admin.context.close();
}
);
