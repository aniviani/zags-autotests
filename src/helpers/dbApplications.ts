export const selectScenarios = {
  appl_status: {
    table: 'reg_office.applications',
    whereField: 'applicationid',
    selectField: 'statusofapplication',
  },

  appl_kind: {
    table: 'reg_office.applications',
    whereField: 'applicationid',
    selectField: 'kindofapplication',
  },
} as const;

export type SelectScenarioKey = keyof typeof selectScenarios;
