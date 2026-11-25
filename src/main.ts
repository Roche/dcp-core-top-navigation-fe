import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { appConfigLoader } from './app/shared/config/app-config';

appConfigLoader.load().then(config => {
  if (config.production) {
    enableProdMode();
  }
  return platformBrowserDynamic().bootstrapModule(AppModule);
})
  .catch(err => console.error(err));
