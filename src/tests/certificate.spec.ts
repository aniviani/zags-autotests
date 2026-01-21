import { test, expect, Browser, Download } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ApplicantDataPage } from '../pages/ApplicantDataPage';
import { ApplicationStatusPage } from '../pages/ApplicationStatusPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { testData, certificateData, certificateScenarios, } from '../config/testData';

async function createAndApproveApplication(browser: Browser) {
  const userContext = await browser.newContext();
  const userPage = await userContext.newPage();
  
  await userPage.goto(process.env.BASE_URL as string);
  await userPage.waitForLoadState('networkidle');

  await new HomePage(userPage).loginAsUser();

  const applicantPage = new ApplicantDataPage(userPage);

  const applicationNumber = await applicantPage.completeMarriageApplication({
    applicant: testData.applicant,
    citizen: testData.citizen,
    marriageService: testData.marriageService,
  });
  
  expect(Number(applicationNumber)).toBeGreaterThan(0);

  const adminContext = await browser.newContext();
  const adminPage = await adminContext.newPage();

  await adminPage.goto(process.env.BASE_URL as string);
  await adminPage.waitForLoadState('networkidle');

  await new HomePage(adminPage).loginAsAdmin();
  await new AdminLoginPage(adminPage).submitAdminLogin(testData.admin);

  const dashboard = new AdminDashboardPage(adminPage);
  await dashboard.waitTable();
  await dashboard.shouldHaveApplicationWithNumber(applicationNumber);

  await dashboard.performAction('approve');
  await dashboard.checkStatus('approved');

  await adminContext.close();

  const statusPage = new ApplicationStatusPage(userPage);
  await statusPage.refreshStatus();

  await expect(statusPage.orderCertificateButton,'Кнопка "Заказать справку" должна появиться').toBeVisible({ timeout: 10000 });

  return { 
    userContext, 
    userPage, 
    statusPage, 
    applicationNumber 
  };
}

test.describe('Функционал "Заказать справку"', () => {
  for (const scenario of certificateScenarios) {
    test(`TC ${scenario.title}`, async ({ browser }) => {
      const {
        userPage,
        statusPage,
        applicationNumber,
      } = await createAndApproveApplication(browser);
      
      await statusPage.openCertificateForm();
      await statusPage.fillCertificateForm(certificateData, applicationNumber);
      await statusPage.processCertificateScenario(scenario.type, {
        email: certificateData.email,
        applicationNumber,
      });

    });
  }
});

