declare var require: any;
const packageJson = require('../../package.json');

export const environment = {
  angularVersion: packageJson.dependencies["@angular/common"].split('.')[0],
  isAppValidated: true,
  appName: 'Top Navigation'
};
