// Replaced during a production build by environment.prod.ts
// (see the `fileReplacements` entry in angular.json).
export const environment = {
  production: false,

  // Generated locally, so the sample runs with no backend. Set false to hit the
  // hosted endpoint instead; proxy.conf.json forwards the path below.
  useMockData: true,

  endApi: '/api/summary'
};
