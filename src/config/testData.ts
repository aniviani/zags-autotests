export const testData = {
  applicant: {
    lastName: 'Иванова',
    firstName: 'Анна',
    middleName: 'Сергеевна',
    phone: '89202864425',
    passport: '123456',
    address: 'г. Тула, ул. Ленина, д.92, кв. 10',
  },

  citizen: {
    lastName: 'Иванов',
    firstName: 'Иван',
    middleName: 'Иванович',
    birthDate: '2001-01-01', 
    passport: '654321',
    gender: 'муж',
    address: 'г. Тула, ул. Агеева, д.26, кв. 21',
  },

  marriageService: {
    registrationDate: '2020-02-20', 
    newLastName: 'Иванова',
    spouseLastName: 'Иванов',
    spouseFirstName: 'Иван',
    spouseMiddleName: 'Иванович',
    spouseBirthDate: '2001-01-01',
    spousePassport: '654321',
  },

    birthService: {
    birthPlace: 'г.Тула',
    mother: 'Иванова Анна Сергеевна',
    father: 'Иванов Иван Иванович',
    grandmother: 'Иванова Мария Петровна',
    grandfather: 'Иванов Петр Алексеевич',
  },

    citizenDeath: {
    lastName: 'Иванов',
    firstName: 'Сергей',
    middleName: 'Петрович',
    birthDate: '1955-03-10', 
    passport: '347827',
    gender: 'муж',
    address: 'г. Тула, ул. Ленина, д.92, кв. 10',
  },

   deathService: {
    deathDate: '2025-11-20', 
    deathPlace: 'г.Тула',
  },

  admin: {
  lastName: 'Петров',
  firstName: 'Петр',
  middleName: 'Петрович',
  phone: '89306796527',
  passport: '987236',
  birthDate: '1976-09-23', 
},
};

export const certificateData = {
  lastName: 'Иванов',
  firstName: 'Иван',
  email: 'ivan@gmail.com',
};

export const applicationStatusMap = {
  approved: {
    uiText: /Одобрена/i,
  },
  rejected: {
    uiText: /Отклонена/i,
  },
  'under consideration': {
    uiText: /На рассмотрении/i,
  },
} as const;

export type ApplicationStatusKey = keyof typeof applicationStatusMap;

export const serviceMap = {
  marriage: /Получение свидетельства о браке/i,
  birth: /Получение свидетельства о рождении/i,
  death: /Получение свидетельства о смерти/i,
} as const;

export type ServiceKey = keyof typeof serviceMap;

export const statusMap = {
  'under consideration': /На рассмотрении/i,
  approved: /Одобрена/i,
  rejected: /Отклонена/i,
} as const;

export type StatusKey = keyof typeof statusMap;

export const certificateScenarios = [
  {
    title: 'Скачивание справки',
    type: 'download',
  },
  {
    title: 'Отправка справки на email',
    type: 'email',
  },
] as const;

export type CertificateScenarioType = typeof certificateScenarios[number]['type'];
