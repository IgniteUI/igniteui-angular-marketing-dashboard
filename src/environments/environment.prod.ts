// The deployed dashboard is served from the same origin as the API, so it can
// address it directly without a proxy.
export const environment = {
  production: true,
  endApi: 'https://www.infragistics.com/angular-sample-apps/marketing-dashboard-api/api/summary'
};
