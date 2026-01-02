import { test, expect, Browser, Download } from '@playwright/test';
import * as fs from 'fs';

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

  await expect(
    statusPage.orderCertificateButton,
    'Кнопка "Заказать справку" должна появиться'
  ).toBeVisible({ timeout: 10000 });

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
      
      if (scenario.type === 'download') {
        await statusPage.submitCertificateForm();
        
        const download: Download = await statusPage.downloadCertificate();
        const filePath = await download.path();
        expect(filePath).not.toBeNull();

        const stats = fs.statSync(filePath!);
        expect(stats.size).toBeGreaterThan(0);
      }
      
      if (scenario.type === 'email') {
        const requestPromise = userPage.waitForRequest((request) => {
          if (request.method() !== 'POST') return false;
          const postData = request.postData();
          if (!postData) return false;
          
          return (
            postData.includes(certificateData.email) &&
            postData.includes(applicationNumber)
          );
        }, { timeout: 15000 }
      );
      
      await statusPage.submitCertificateForm();
      const request = await requestPromise;
      
      expect(
        request.postData(),
        'Тело запроса должно содержать email'
      ).toContain(certificateData.email);
      
      expect(
        request.postData(),
        'Тело запроса должно содержать номер заявки'
      ).toContain(applicationNumber);
    }
  });
}
});
