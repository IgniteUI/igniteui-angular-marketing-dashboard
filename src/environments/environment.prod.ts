export const environment = {
  production: true,

  useMockData: false,

  // Relative, so staging never calls production's API. Resolves against
  // <base href>, which the deploy emits with a trailing slash.
  endApi: '../marketing-dashboard-api/api/summary'
};
