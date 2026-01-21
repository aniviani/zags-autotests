import { ServiceSelectionPage } from '../pages/ServiceSelectionPage';
import { ServiceDataPage } from '../pages/ServiceDataPage';
import { testData } from '../config/testData';

export const registrationScenarios = [
  {
    title: 'Успешная регистрация брака',
    expectedDbKind: 'Получение свидетельства о браке',
    selectService: (servicePage: ServiceSelectionPage) =>
      servicePage.selectMarriageRegistration(),
    citizenData: testData.citizen,
    fillServiceData: (serviceDataPage: ServiceDataPage) =>
      serviceDataPage.fillMarriageData(testData.marriageService),
  },
  {
    title: 'Успешная регистрация рождения',
    expectedDbKind: 'Получение свидетельства о рождении',
    selectService: (servicePage: ServiceSelectionPage) =>
      servicePage.selectBirthRegistration(),
    citizenData: testData.citizen,
    fillServiceData: (serviceDataPage: ServiceDataPage) =>
      serviceDataPage.fillBirthData(testData.birthService),
  },
  {
    title: 'Успешная регистрация смерти',
    expectedDbKind: 'Получение свидетельства о смерти',
    selectService: (servicePage: ServiceSelectionPage) =>
      servicePage.selectDeathRegistration(),
    citizenData: testData.citizenDeath,
    fillServiceData: (serviceDataPage: ServiceDataPage) =>
      serviceDataPage.fillDeathData(testData.deathService),
  },
] as const;