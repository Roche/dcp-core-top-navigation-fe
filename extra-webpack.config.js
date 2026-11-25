const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const { ModuleFederationPlugin } = require('webpack').container;
const packageJson = require('./package.json');
const deps = packageJson.dependencies;
const name = packageJson.name;

module.exports = (angularWebpackConfig, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(angularWebpackConfig, options);

  // Merge your custom Module Federation configuration
  singleSpaWebpackConfig.plugins.push(
    new ModuleFederationPlugin({
      // This is the unique name of your application
      name,
      shared: {
        // Core platform services — singleton so all microfrontends share one instance
        '@open-dcp/services': {
          singleton: true,
          strictVersion: false,
          requiredVersion: deps['@open-dcp/services'],
        },
        '@open-dcp/angular-services': {
          singleton: true,
          strictVersion: false,
          requiredVersion: deps['@open-dcp/angular-services'],
        },
        // Platform component / style libraries — share one copy across all MFEs
        '@open-dcp/angular-basic-components': {
          singleton: true,
          strictVersion: false,
          requiredVersion: deps['@open-dcp/angular-basic-components'],
        },
        // Angular packages — deduplicate across microfrontends
        '@angular/core': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/core'] },
        '@angular/common': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/common'] },
        '@angular/common/http': { singleton: true, strictVersion: false },
        '@angular/router': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/router'] },
        '@angular/forms': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/forms'] },
        '@angular/platform-browser': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/platform-browser'] },
        '@angular/platform-browser-dynamic': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/platform-browser-dynamic'] },
        '@angular/animations': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/animations'] },
        '@angular/cdk': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/cdk'] },
        '@angular/material': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/material'] },
        '@angular/localize': { singleton: true, strictVersion: false, requiredVersion: deps['@angular/localize'] },
        // RxJS
        'rxjs': { singleton: true, strictVersion: false, requiredVersion: deps['rxjs'] },
        // i18n
        '@ngx-translate/core': { singleton: true, strictVersion: false, requiredVersion: deps['@ngx-translate/core'] },
        // Moment
        'moment': { singleton: true, strictVersion: false, requiredVersion: deps['moment'] },
        'moment-timezone': { singleton: true, strictVersion: false, requiredVersion: deps['moment-timezone'] },
        // Permission management — must be singleton so all MFEs share the same permission state
        'ngx-permissions': { singleton: true, strictVersion: false, requiredVersion: deps['ngx-permissions'] },
        // Idle detection — singleton so only one idle timer runs across the platform
        '@ng-idle/core': { singleton: true, strictVersion: false, requiredVersion: deps['@ng-idle/core'] },
        '@ng-idle/keepalive': { singleton: true, strictVersion: false, requiredVersion: deps['@ng-idle/keepalive'] },
      }
    })
  );

  // Force Webpack to treat 'single-spa' and 'zone.js' as external dependencies.
  // single-spa: looked up from the import map in index.html.
  // zone.js: always bootstrapped globally by the shell (root-config) before any Angular
  //          microfrontend is mounted — bundling it again only wastes bytes.
  singleSpaWebpackConfig.externals = [
    ...(singleSpaWebpackConfig.externals || []),
    'single-spa',
    'zone.js',
  ];

  // Disable chunk splitting so the microfrontend ships as a single main.js.
  // Code-splitting is counterproductive here: the import map only registers one
  // URL for this MFE, shared libraries are deduplicated by Module Federation, and
  // lazy routes are not used. Having many numbered chunk files adds HTTP round-trips
  // without any caching benefit (chunk names change on every build).
  singleSpaWebpackConfig.optimization = {
    ...(singleSpaWebpackConfig.optimization || {}),
    splitChunks: false,
    runtimeChunk: false,
  };

  // The public path is set at runtime by src/single-spa/set-public-path.ts (no build-time deployUrl). 'auto' does not
  // work here: the UMD bundle runs after its <script> finished (no document.currentScript) and has no import.meta.
  singleSpaWebpackConfig.output.publicPath = '';

  // Feel free to modify this webpack config however you'd like to
  return singleSpaWebpackConfig;
}
