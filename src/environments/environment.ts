// Replaced during a production build by environment.prod.ts
// (see the `fileReplacements` entry in angular.json).
//
// A relative path so the request is same-origin and the dev server proxies it
// to the hosted API (see proxy.conf.json). The API advertises CORS methods and
// headers but never sends Access-Control-Allow-Origin, so a browser cannot call
// it cross-origin directly.
export const environment = {
  production: false,
  endApi: '/api/summary'
};
