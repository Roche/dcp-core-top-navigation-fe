import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AppTopComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgxPermissionsModule} from 'ngx-permissions';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {Angulartics2Module} from 'angulartics2';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';
import {environment} from '../environments/environment';
import {EmptyRouteComponent} from './empty-route/empty-route.component';
import {AppRoutingModule} from './app-routing.module';
import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {GxpLabelTopNavigationComponent} from "./gxp-label/gxp-label.component";
import {TopNavigationComponent} from "./top-navigation/top-navigation.component";
import {TopLoadingBarComponent} from "./top-loading-bar/top-loading-bar.component";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {
  DcHttp,
  GxpApp,
  GxpInfoInterceptor,
  NonAuthInterceptor,
  OdcpPermissionsService,
  APP_CONFIG,
  provideRuntimeConfig,
} from "@open-dcp/angular-services";
import {AppConfig, appConfigLoader} from './shared/config/app-config';
import {assetUrl} from '../single-spa/asset-url';
import {UserService} from "./shared/user.service";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AlertsService} from "./shared/alerts.service";
import {MatTooltip} from "@angular/material/tooltip";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {ToastrModule} from "ngx-toastr";
import {MatToolbar} from "@angular/material/toolbar";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatDrawer, MatDrawerContainer} from "@angular/material/sidenav";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {ParcelComponent} from "single-spa-angular/parcel";
import {AppTopButtonSectionComponent} from "./top-navigation/top-button-section.component";
import {AppFabButtonSection} from "./fab-button/fab-button-section";
import {AppAuxiliarySectionComponent} from "./auxiliary-button/auxiliary-section";

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(target: T, source: U): T & U {
  const result: Record<string, unknown> = {...target};

  Object.keys(source || {}).forEach((key) => {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
      return;
    }

    result[key] = sourceValue;
  });

  return result as T & U;
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient, config: AppConfig) {

  return {
    getTranslation(lang: string): Observable<any> {
      return new MultiTranslateHttpLoader(http, [
        {prefix: `${config.baseAppUrl}js/i18n/`, suffix: '.json'},
        {prefix: assetUrl('translations/'), suffix: '-top-navigation.json'},
      ]).getTranslation(lang).pipe(map(translations => {
        const storage = window.sessionStorage;
        const dcpTranslations = JSON.parse(storage.getItem('dcpTranslations')) || {en: {}, de: {}};
        return deepMerge(translations, dcpTranslations[lang] || {});
      }));
    }
  };
}

@NgModule({
  declarations: [
    AppTopComponent,
    TopNavigationComponent,
    TopLoadingBarComponent,
    EmptyRouteComponent,
    UserSettingsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NgIdleKeepaliveModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      closeButton: false
    }),
    GxpLabelTopNavigationComponent,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, APP_CONFIG],
      },
    }),
    NgxPermissionsModule.forRoot(),
    Angulartics2Module.forRoot(),
    MatProgressBar,
    MatTooltip,
    MatFormField,
    MatLabel,
    FormsModule,
    MatIcon,
    MatInput,
    MatIconButton,
    MatToolbar,
    MatButton,
    MatMenuTrigger,
    MatSuffix,
    MatMenu,
    MatMenuItem,
    MatDrawerContainer,
    MatDrawer,
    MatCheckbox,
    MatError,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    InfoModalComponent,
    ParcelComponent,
    AppTopButtonSectionComponent,
    AppFabButtonSection,
    AppAuxiliarySectionComponent
  ],
  providers: [
    UserService,
    DcHttp,
    OdcpPermissionsService,
    AlertsService,
    provideRuntimeConfig(appConfigLoader),
    {
      provide: GxpApp,
      useValue: {
        name: environment.appName,
        isValidated: environment.isAppValidated
      }
    },
    { provide: HTTP_INTERCEPTORS, useClass: GxpInfoInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: NonAuthInterceptor, multi: true },
  ],
  bootstrap: [AppTopComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
