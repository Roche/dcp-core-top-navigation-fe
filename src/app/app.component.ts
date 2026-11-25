import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {BehaviorSubject, Subscription} from "rxjs";
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {AlertsService} from "./shared/alerts.service";
import {uiStore, userStore} from "@open-dcp/services";
import {UserService} from "./shared/user.service";
import {MatDialog} from "@angular/material/dialog";
import {InfoModalComponent} from "./info-modal/info-modal.component";
import {OdcpPermissionsService} from "@open-dcp/angular-services";

export const WIDE_SIDENAV = 'wide';

@Component({
  selector: 'app-top-navigation-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppTopComponent implements OnInit, OnDestroy {

  public subscription: Subscription = new Subscription();

  forceDimOverlay: boolean = false;

  applyCustomOverlayWidth: boolean = false;
  applyCustomOverlayWidth2x: boolean = false;

  userIsLoaded = new BehaviorSubject<boolean>(false);

  constructor(
    public readonly alertService: AlertsService,
    public readonly translate: TranslateService,
    public readonly router: Router,
    private readonly dcPermissionsService: OdcpPermissionsService,
    public readonly deviceService: DeviceDetectorService,
    private readonly ngZone: NgZone,
    private readonly userService: UserService,
    private readonly dialog: MatDialog
  ) {
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('de');
    translate.setDefaultLang('en');
    const lang = uiStore.getState().language || 'en'
    translate.use(lang);

    this.subscription.add(
      uiStore.subscribe('language', (language) => {
        this.ngZone.run(() => {
          if (language) {
            translate.use(language);
          }
        })
      })
    );
  }

   async ngOnInit() {
     this.seedGlobalSiteContextIfMissing();
     const siteIdAfterSeeding = uiStore.getState()?.site?.id;

     this.syncWithOdcpService();
     const userState = userStore.getState();

     if (typeof siteIdAfterSeeding === 'number') {
       this.dcPermissionsService.initPermissions(siteIdAfterSeeding);
     }

    this.subscription.add(
      uiStore.subscribe('site', site => {
        this.ngZone.run(() => {
          const value = site?.id;

          if (typeof value === 'number') {
            this.dcPermissionsService.initPermissions(value);
          } else {
            this.seedGlobalSiteContextIfMissing();
          }

          const index = window.location.href.split('/').indexOf('app') + 1;
          const siteContext = window.location.href.split('/')[index];
          const targetSiteSegment = this.getSitePathSegment(value);
          if (targetSiteSegment && siteContext !== targetSiteSegment) {
            // [LOOP-FIX] Site swap may target a content (.../menu/...) URL that this
            // shell router now ignores; navigate via single-spa history instead.
            history.pushState(null, '', window.location.pathname.replace(siteContext, targetSiteSegment));
          }
        })
      })
    );

     const browserInfo = this.deviceService.getDeviceInfo();
     if (browserInfo.browser.toLowerCase() !== 'chrome') {
       this.translate.get('VALIDATIONS.CHROME_BROWSER_NOTIFICATION').subscribe(err => {
         const browserInfoText = err;
         this.openInfoModal(browserInfoText);
       });
     }


    this.subscription.add(
      userStore.subscribe('sites', result => {
        this.ngZone.run(() => {
          this.seedGlobalSiteContextIfMissing();
          this.subscription.add(
            uiStore.subscribe('site', site => {
              this.ngZone.run(() => {
                const uiLocal = JSON.parse(localStorage.getItem('ui') || '{}');
                if (typeof site?.id === 'number' && site.id !== uiLocal.siteContext) {
                  localStorage.setItem('ui', JSON.stringify({...uiLocal, siteContext: site.id}));
                  this.dcPermissionsService.initPermissions(site.id);
                }
              })
            })
          );
        })
      })
    );

    this.subscribeToLogout();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.updateLocalStorage();
  }

  private openInfoModal(browserInfoText: string) {
    const dialogRef = this.dialog.open(InfoModalComponent, {
      width: '400px',
      minWidth: '300px',
      panelClass: 'model-preview',
      data: { infoText: browserInfoText } // This replaces @Input()
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  private updateLocalStorage() {
    this.updateUiLocalStorageOnExit();
    this.updateUserOnExit();
  }

  updateUserOnExit() {
    const user = userStore.getState();
    const localUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      const updatedUser = {
        ...localUser,
        current: {
          ...localUser.current,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        }
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  updateUiLocalStorageOnExit() {
    const uiState = uiStore.getState();
    const localUi = JSON.parse(localStorage.getItem('ui') || '{}');
    localStorage.setItem('ui', JSON.stringify({
      ...localUi,
      ...uiState,
      activeModules: uiState.activeModules.map(el => ({
        ID: el.id,
        IsEnable: el.enabled,
        ModuleName: el.name,
        SiteID: el.siteId
      })),
      siteContext: uiState.site?.id,
      siteTimeZOneName: uiState.site?.timeZone,
      siteUTCOffset: uiState.site?.utcOffset,
      siteShortName: uiState.site?.name
    }));
  }

  private syncWithOdcpService() {
    this.subscription.add(
      uiStore.subscribe('messages', (messages) => {
        this.ngZone.run(() => {
          if (messages.length > 0) {
            const msg = uiStore.dequeueMessage();

            if (msg){
              switch (msg.type) {
                case "success":
                  this.alertService.onSuccess(msg.message);
                  break;
                case "warning":
                  this.alertService.onWarning(msg.message);
                  break;
                case "error":
                  this.alertService.onError(msg.message);
                  break;
                case "info":
                  this.alertService.onInfo(msg.message);
                  break;
                default:
                  break;
              }
            }
          }
        });
      })
    );

    const token = userStore.getState().token;
    if (token) {
      this.triggerRefreshToken(token);
    }

    this.subscription.add(
      userStore.subscribe('token', newToken => {
        this.ngZone.run(() => {
          if (newToken) {
            this.triggerRefreshToken(newToken);
          }
        });
      })
    );
  }


  private triggerRefreshToken(token: string) {
    if (!this.userIsLoaded.getValue()) {
      this.userService.setTimeoutForRefreshToken(token);
      this.userIsLoaded.next(true);
    }
  }

  private getSitePathSegment(siteId: unknown): string | null {
    if (typeof siteId !== 'number') {
      return null;
    }
    const currentSegment = this.getCurrentSitePathSegment();
    if (siteId === 0 && currentSegment === 'global') {
      return 'global';
    }
    return `${siteId}`;
  }

  private getCurrentSitePathSegment(): string | null {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const appIndex = segments.indexOf('app');
    if (appIndex < 0) {
      return null;
    }
    return segments[appIndex + 1] || null;
  }

  private hasGlobalPermissions(): boolean {
    const permissions = (userStore.getState() as any)?.permissions;
    if (!Array.isArray(permissions)) {
      return false;
    }
    return permissions.some((permission: any) =>
      permission?.SiteId === 0 || permission?.SiteName === 'GLOBAL'
    );
  }

  private seedGlobalSiteContextIfMissing(): void {
    const currentSiteId = uiStore.getState()?.site?.id;
    if (typeof currentSiteId === 'number') {
      return;
    }
    if (!this.hasGlobalPermissions()) {
      return;
    }
    uiStore.setCurrentSite({
      id: 0,
      name: 'GLOBAL',
      timeZone: 'UTC',
      utcOffset: 0
    });
  }

  closeCustomSidebar() {
    // TODO
  }


  private subscribeToLogout() {
    this.subscription.add(
      userStore.subscribe('logout', logout => {
        if (!logout) {
          return;
        }

        this.userService.logoutAndRedirect();

        uiStore.clearMessages();
        const loading = Object.keys(uiStore.getState().loading);
        loading.forEach(key => uiStore.removeLoading(key));
        userStore.clearLogout();
      })
    );
  }

}
