import {OnInit, OnDestroy, Component, ViewChild, AfterViewInit, Input, NgZone, DestroyRef, inject} from '@angular/core';
import {BehaviorSubject, lastValueFrom, Observable, Subscription} from 'rxjs';
import {APP_CONFIG} from '@open-dcp/angular-services';
import {AppConfig} from '../shared/config/app-config';
import {DocumentInterruptSource, Idle} from '@ng-idle/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MatDrawer} from '@angular/material/sidenav';
import {SharedConstants} from "../shared/shared-constant";
import {PermissionEntry, uiStore, userStore} from "@open-dcp/services";
import {UserService} from "../shared/user.service";
import {AlertsService} from "../shared/alerts.service";
import {MatDialog} from "@angular/material/dialog";
import {UserSettingsComponent} from "../user-settings/user-settings.component";
import {NgxPermissionsService} from "ngx-permissions";
import {bindMindAction, bindMindContext} from '@open-dcp/mind-integration/angular';
import {MindActionResult} from '@open-dcp/mind-integration';
import {mindRegistry, MindContextAction, MindContextKey, MIND_SCOPE} from '../shared/mind-context';
import {UserDateFormatSettings, UserTimeFormatSettings} from '../shared/user.model';
import * as moment from 'moment';
import {getRuntimeLogoSrc, hasRuntimeLogoColour} from '../shared/runtime-logo';

const IDLE_TIME = 840;
const IDLE_TIMEOUT = 60;

function parseTimeZoneOffsetMinutes(timeZoneName: string): number {
  const match = timeZoneName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/i);
  if (!match) {
    return 0;
  }

  const sign = match[1] === '-' ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] || '0');

  return sign * ((hours * 60) + minutes);
}

function getTimeZoneOffsetMinutes(timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'shortOffset'
  }).formatToParts(new Date());

  const timeZoneName = parts.find((part) => part.type === 'timeZoneName')?.value || 'GMT+00';

  return parseTimeZoneOffsetMinutes(timeZoneName);
}

function formatOffsetForUi(offsetMinutes: number): string {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60).toString().padStart(2, '0');
  const minutes = (absolute % 60).toString().padStart(2, '0');

  return `${sign}${hours}${minutes}`;
}

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() appDontUseLayoutComponent = false;

  private readonly config = inject<AppConfig>(APP_CONFIG);
  baseAppPath: string = this.config.baseAppUrl;

  // With a runtime colour the logo starts empty (space reserved), so the default blue never flashes.
  private readonly defaultLogoUrl: string = this.baseAppPath + 'assets/images/dcp-logo.svg';
  logoSrc: string | null = hasRuntimeLogoColour() ? null : this.defaultLogoUrl;

  helpUrl: string = this.config.helpUrl ?? '';

  mailUrl: string = this.config.mailUrl ?? '';

  issueUrl: string = this.config.issueUrl ?? '';

  public userDisplayName: string;

  public userInitials: string;

  public subscription: Subscription = new Subscription();

  loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public showMenu = true;

  public showIdleWarning = false;

  getSiteLoading = new BehaviorSubject(false);

  public errors: any = {};

  public sites: {
    SiteId: number;
    Name: string;
    ShortName: string;
    TimeZone: string;
    HasMinimumPermissions?: boolean;
    IsEnable?: boolean;
  }[] = [];

  public siteTimezone = '';

  siteIsSelected = false;

  public helpText = '';

  public currentRoute = 'dashboard';

  siteSelectionEnable = new BehaviorSubject<boolean>(uiStore.getState().enableSiteSelection);

  public permissions$ = new BehaviorSubject<PermissionEntry[]>([]);

  isGlobalAdmin: boolean;

  isGlobalApiUser: boolean;

  hasSitesAssociated: boolean;

  sharedConstants = SharedConstants;

  public selectedSite;

  // Hidden for global apps (e.g. /app/global/...), shown for site-scoped apps (e.g. /app/14/...).
  public showSiteSelect = true;

  public siteContext$ = new BehaviorSubject<number>(uiStore.getState()?.site?.id);

  public userLevel: string;



  public dcsidedrawerRef: any;

  // MIND context updater functions (app -> MIND). No-ops until MIND integration is set up.
  private updateMindLanguage: (value: unknown) => void = () => undefined;
  private updateMindSiteId: (value: unknown) => void = () => undefined;
  private updateMindSiteName: (value: unknown) => void = () => undefined;
  private updateMindDateFormat: (value: unknown) => void = () => undefined;
  private updateMindTimeFormat: (value: unknown) => void = () => undefined;
  private updateMindAvailableSites: (value: unknown) => void = () => undefined;

  // The localStorage key we will use for the lock
  private readonly LEADER_LOCK_KEY = 'activeTabId';
  private readonly CURRENT_TAB_ID = 'currentTabId';

  @ViewChild('dcsidedrawer') set content(content: any) {
    this.dcsidedrawerRef = content;
  }
  public get dcsidedrawer(): MatDrawer {
    return this.dcsidedrawerRef;
  }

  constructor(
    private readonly idle: Idle,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    public readonly translate: TranslateService,
    private readonly userService: UserService,
    private readonly ngZone: NgZone,
    private readonly alertsService: AlertsService,
    private readonly dialog: MatDialog,
    private readonly permissionService: NgxPermissionsService,
    private readonly destroyRef: DestroyRef
  ) {
    const initialSiteId = uiStore.getState()?.site?.id;
    if (typeof initialSiteId === 'number') {
      this.populateSelectedSite(initialSiteId);
    }
    this.subscription.add(
      uiStore.subscribe('language', lang => {
        this.ngZone.run(() => {
          if (lang) {
            this.langChange(lang);
          } else {
            this.langChange('en');
          }
        })
      })
    );
  }

  ngOnInit() {
    if (this.logoSrc === null) {
      getRuntimeLogoSrc(this.defaultLogoUrl).then(src => this.ngZone.run(() => this.logoSrc = src));
    }

    this.checkForInitialActiveModules();

    this.populateAdminRights();

    this.subscription.add(
      uiStore.subscribe('enableSiteSelection', enableSiteSelection => {
        this.ngZone.run(() => {
          this.siteSelectionEnable.next(enableSiteSelection);
        })
      })
    );

    this.subscribeToDisplayName();

    this.subscribeToIsAuthenticated();

    if (this.appDontUseLayoutComponent) {
      window.addEventListener('storage', this.checkSessionStorageTokenChange);
    }


    this.subscription.add(
      uiStore.subscribe('site', site => {
        this.ngZone.run(() => {
          if (site && typeof site.id === 'number') {
            this.siteContext$.next(site.id);
          }
        })
      })
    );

    this.subscribeToTimeZone();

    this.subscribeToSites();

    this.setUrlOnRouterChange();

    this.updateShowSiteSelect();
    window.addEventListener('popstate', this.updateShowSiteSelect);

    this.subscription.add(
      this.translate.get('ERROR.IDLE_ERROR_TITLE').subscribe((val) => {
        this.errors.idleTitle = val;
      })
    );
    this.subscription.add(
      this.translate.get('ERROR.IDLE_ERROR_BODY').subscribe((val) => {
        this.errors.idleBody = val;
      })
    );

    this.subscribeToPermissions();

    this.subscribeToLoading();

    this.setupMindIntegration();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    window.removeEventListener('storage', this.checkSessionStorageTokenChange);
    window.removeEventListener('popstate', this.updateShowSiteSelect);
  }

  ngAfterViewInit() {  }

  resetWatch() {
    this.idle.watch();
    this.showIdleWarning = false;
  }

  /**
   * Change lang in store and set correct lang help text
   */
  langChange(e) {
    uiStore.setLanguage(e);
  }

  /**
   * Change site context and reset filter
   */
  siteChange(e, hasMinimumPermissions) {
    if (!hasMinimumPermissions) {
      return;
    }

    // Stop the process if user select current site
    const currentSite = uiStore.getState()?.site?.id;
    if (typeof currentSite === 'number' && currentSite === e) {
      return;
    }

    this.changeSite(e);

  }

  private changeSite(siteId: number) {
    uiStore.setLoading('getSiteModules');
    lastValueFrom(this.userService.getSiteModules(siteId))
      .then(res => {
        this.setActiveModulesToUiStore(res, siteId);
        this.populateSelectedSite(siteId);
        this.siteIsSelected = true;

        // Obsolete API call that should be removed when all applications start using Core V2 and Top navigation
        this.userService.changeSiteInCoreV1();
      })
      .finally(() => {
        uiStore.removeLoading('getSiteModules');
      })
  }

  private subscribeToTimeZone() {
    this.subscription.add(
      uiStore.subscribe('site', site => {
        this.ngZone.run(() => {
          if (!site?.timeZone) {
            this.siteTimezone = '';
            return;
          }
          const tzName = site.timeZone;
          const utcOffset = formatOffsetForUi(getTimeZoneOffsetMinutes(tzName));
          this.siteTimezone = `${tzName} : UTC ${utcOffset}`;
        })
      })
    );
  }

  isTrueString(dataItemElement: string | boolean) {
    return String(dataItemElement).toLowerCase() === 'true';
  }

  /**
   * [LOOP-FIX] Change the URL via single-spa (history.pushState) rather than this
   * shell's inert Angular Router, so the micro-frontend that owns the route
   * handles it and the two routers don't fight over history.state.
   */
  public navigate(path: string): void {
    history.pushState(null, '', path);
  }

  logout() {
    // Explicit logout should not seed redirectTo for the next user session.
    uiStore.setRedirectTo('');
    this.logoutAndRedirect();
  }

  toggleDrawer() {
    this.dcsidedrawer.toggle();
  }

  getSiteTooltip(hasMinimumPermissions: boolean, isEnabled: boolean): string {
    if (hasMinimumPermissions && isEnabled) {
      return '';
    } else if (!hasMinimumPermissions) {
      return this.translate.instant('DONT_HAVE_MIN_PERMISSIONS');
    }
    return this.translate.instant('SITE_CURRENTLY_DISABLED');
  }

  openSettings() {
    this.dialog.open(UserSettingsComponent, {
      width: '400px',
      maxWidth: '80vw',
      minWidth: '300px',
      panelClass: 'model-preview'
    });
  }

  private subscribeToDisplayName() {

    this.populateDisplayName(userStore.getState().displayName);
    this.subscription.add(
      userStore.subscribe('displayName', (result) => {
        this.ngZone.run(() => {
          this.populateDisplayName(result);
        })
      })
    );
  }

  private populateDisplayName(result: string) {
    if (result) {
      this.userInitials = '';
      this.userDisplayName = result;
      this.userDisplayName?.split(' ')?.forEach((name) => {
        this.userInitials += name[0] || '';
      });
    } else {
      this.userDisplayName = '';
      this.userInitials = '';
    }
  }

  private runIdle() {
    const token = userStore.getState().token;
    Object.keys(uiStore.getState().loading).forEach((key) => {
      uiStore.removeLoading(key);
    });
    if (token) {
      sessionStorage.removeItem(SharedConstants.logoutInProgressKey);
      this.showMenu = true;
      // sets an idle timeout of 5 seconds, for testing purposes.
      this.idle.setIdle(IDLE_TIME);
      // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
      this.idle.setTimeout(IDLE_TIMEOUT);
      // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
      this.idle.setInterrupts( [new DocumentInterruptSource(
        'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'
      )]);

      this.idle.setIdleName(sessionStorage.getItem(this.CURRENT_TAB_ID));

      this.subscription.add(
        this.idle.onIdleEnd.subscribe(() => {
          uiStore.clearMessages();
          this.alertsService.clearAll();

          this.showIdleWarning = false;
          this.userService.triggerRefreshToken();
        })
      );
      this.subscription.add(
        this.idle.onTimeout.subscribe(() => {
          uiStore.clearMessages();
          this.alertsService.clearAll();

          this.showIdleWarning = false;
          this.idle.stop();

          this.logoutAndRedirect();
        })
      );
      this.subscription.add(
        this.idle.onTimeoutWarning.subscribe(() => {
          const leaderId = localStorage.getItem(this.LEADER_LOCK_KEY);
          const myTabId = sessionStorage.getItem(this.CURRENT_TAB_ID);
          // Check if there is no leader, OR if I am already the leader
          if (!leaderId || leaderId === myTabId) {
            // If no leader, I will claim leadership
            if (!leaderId) {
              localStorage.setItem(this.LEADER_LOCK_KEY, myTabId);
            }

            if (!this.showIdleWarning) {
              this.alertsService.clearAll();
              setTimeout(() => {
                this.alertsService.onCountdown(this.errors.idleBody, IDLE_TIMEOUT);
              });
              this.showIdleWarning = true;
            }
          }
        })
      );
      this.resetWatch();
    } else {

      this.showMenu = false;
      this.idle.stop();

      const wasLogout = sessionStorage.getItem(SharedConstants.logoutInProgressKey) === 'true';
      sessionStorage.removeItem(SharedConstants.logoutInProgressKey);

      if (!wasLogout) {
        const target = window.location.pathname + window.location.search;
        if (target !== '/' && !target.startsWith('/login')) {
          uiStore.setRedirectTo(target);
        }
      }

      const logoutLink = userStore.getState().logoutLink;
      if (logoutLink) {
        userStore.resetLogoutLink();
        window.location.href = logoutLink;
      } else {
        history.pushState(null, '', '/login');
      }
    }
  }

  private subscribeToIsAuthenticated() {
    let isLoaded = false;

    if (userStore.getState().token) {
      this.runIdle();
      isLoaded = true;
      return;
    }
    this.subscription.add(
      userStore.subscribe('token', (result) => {
        if (isLoaded) {
          return;
        }
        isLoaded = true;
        this.ngZone.run(() => {
          this.runIdle();
        })
      })
    );
  }

  private populateAdminRights() {
    this.hasSitesAssociated = userStore.getState().sites?.length > 0;

    this.subscription.add(
      this.permissionService.permissions$.subscribe((permissions: any) => {
        this.isGlobalAdmin = permissions['PLATFORMADMIN'];
        this.isGlobalApiUser = permissions['PLATFORMAPIUSER'];


        this.hasSitesAssociated = userStore.getState().sites?.length > 0;
      })
    );
  }

  private subscribeToSites() {
    const sites = userStore.getState().sites;
    this.populateSites(sites);
    const siteId = uiStore.getState()?.site?.id;
    if (typeof siteId === 'number') {
      this.populateSelectedSite(siteId);
    }

    this.subscription.add(
      userStore.subscribe('sites', result => {
        this.ngZone.run(() => {
          this.populateSites(result);

          this.subscription.add(
              uiStore.subscribe('site', newSite => {
                this.ngZone.run(() => {
                  if (typeof newSite?.id === 'number') {
                    this.populateSelectedSite(newSite.id);
                  }
                })
              })
          );
        });
      })
    );
  }

  populateSites(result: any[]) {
    if (result) {
      const selectedSiteId = uiStore.getState()?.site?.id;

      const sitePermissions = userStore.getState().permissions;
      const sites = result.map((value) => {
        const site = value;

        const hasMinimumPermissions = sitePermissions.filter(
            (permission) => {
              return (
                  permission.SiteId === site.SiteId &&
                  ['VIEWER', 'ADMIN'].indexOf(permission.Permission) > -1
              );
            }
        );

        if (typeof selectedSiteId === 'number' && site.SiteId === selectedSiteId && !site.IsEnable) {
          history.pushState(null, '', `/app/${selectedSiteId}/site-disabled`);
          return site;
        }

        return {
          ...site,
          HasMinimumPermissions: hasMinimumPermissions.length > 0,
        }
      });

      this.sites = [...sites].sort((a, b) => (a.Name || '').localeCompare(b.Name || ''));

      const currentSiteId = uiStore.getState()?.site?.id;
      if (typeof currentSiteId === 'number' && !this.sites.map(el => el.SiteId).includes(currentSiteId) && this.sites[0]) {
        this.changeSite(this.sites[0].SiteId);
      }
    } else {
      this.sites = [];
    }

    // Keep the options MIND can choose from in sync with the site list.
    this.publishAvailableSites();
  }

  populateSelectedSite(siteId: number) {
    if (typeof siteId !== 'number') {
      return;
    }
    if(this.selectedSite && this.selectedSite.SiteId === siteId) {
      return;
    }

    const siteIndex = this.sites.findIndex(
        (el) => el.SiteId === siteId
    );

    this.selectedSite = this.sites[siteIndex];

    if (this.selectedSite) {
      if (this.selectedSite.SiteId === uiStore.getState()?.site?.id) {
        return;
      }
      const utcOffset = getTimeZoneOffsetMinutes(this.selectedSite.TimeZone) / 60;
      uiStore.setCurrentSite({
        id: this.selectedSite.SiteId,
        name: this.selectedSite.ShortName,
        timeZone: this.selectedSite.TimeZone,
        utcOffset,
      });
    }
  }

  /**
   * Toggles the site selector based on the current URL, read natively from
   * window.location (not the Angular Router) because several single-spa apps
   * share the screen and we must not couple this to the shell's router.
   * Site-scoped routes look like /app/14/..., global ones like /app/global/....
   */
  updateShowSiteSelect = () => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const appIndex = segments.indexOf('app');
    const siteSegment = appIndex >= 0 ? segments[appIndex + 1] : undefined;
    const showSiteSelect = /^\d+$/.test(siteSegment ?? '');

    this.ngZone.run(() => {
      this.showSiteSelect = showSiteSelect;
    });
  };

  setUrlOnRouterChange() {
    // Initial values
    this.currentRoute = this.router.url.substr(1);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url.charAt(0) === '/') {
        this.currentRoute = event.url.substr(1);
      }
    });
    // Here we also use popstate event because if the url change is made outside Angular zone
    // Router.events doesn't trigger
    window.addEventListener('popstate', (event) => {
      // Log the state data to the console
      const url = event?.state?.current;
      if (url && url.charAt(0) === '/') {
        this.currentRoute = url.substr(1);
      }
    });
  }

  checkSessionStorageTokenChange = (event) => {
    if (event.storageArea != localStorage) return;
    if (event.key === 'user' && JSON.parse(event.newValue)['current']['access_token'].length === 0) {
      this.logoutAndRedirect();
    } else if (event.key === 'user' && JSON.parse(event.newValue)['current']['access_token'] !== JSON.parse(event.oldValue)['current']['access_token']) {
      this.resetWatch();
    }
  }

  private logoutAndRedirect() {
    this.userService.logoutAndRedirect();
  }

  private subscribeToPermissions() {
    this.setUserLevel(userStore.getState().permissions);

    this.subscription.add(
      userStore.subscribe('permissions', permissions => {
        this.setUserLevel(permissions);
      })
    );
  }

  private setUserLevel(permissions: PermissionEntry[]) {
    this.ngZone.run(() => {
      if (permissions && permissions.length > 0) {
        this.userLevel = '';
        const sortedPermissions = [...permissions];
        sortedPermissions
          .sort((a, b) =>
            (a.SiteName || '').localeCompare((b.SiteName || ''))
            || a.Module.localeCompare(b.Module)
            || a.Permission.localeCompare(b.Permission)
          )
          .forEach((value) => {
            const { SiteName, Module, Permission } = value;
            this.userLevel += `${SiteName ? SiteName + ':' : ''} ${Module} - ${Permission} \n`;
          });
      } else {
        this.userLevel = '';
      }
    })
  }

  subscribeToLoading() {
    this.subscription.add(
      uiStore.subscribe('loading', loading => {
        if (loading['getUserSite'] || loading['changeSite']) {
          this.getSiteLoading.next(true);
          return;
        }
        this.getSiteLoading.next(false);
      })
    )
  }

  private setActiveModulesToUiStore(res: any, siteId?: number) {
    if (!res) {
      return;
    }
    const targetSiteId = typeof siteId === 'number' ? siteId : uiStore.getState()?.site?.id;
    if (typeof targetSiteId !== 'number') {
      return;
    }
    uiStore.setActiveModules(res.map(el=> ({
      enabled: el.IsEnabled,
      name: el.Name,
      siteId: targetSiteId
    })));
  }

  private checkForInitialActiveModules() {
    const {activeModules, site} = uiStore.getState();
    const siteId = site?.id;
    if (activeModules.length === 0 && typeof siteId === 'number') {
      lastValueFrom(this.userService.getSiteModules(siteId))
        .then(res => {
          this.setActiveModulesToUiStore(res);
        })
        .catch(() => undefined);
      return;
    }
  }

  /**
   * Wires the Top Navigation into the MIND context/action registry.
   *
   * - Publishes current language, site and date/time settings as context
   *   (app -> MIND), kept in sync with the stores.
   * - Registers the three selectable options as actions MIND can invoke
   *   (MIND -> app): change language, change site, change date/time settings.
   *
   * All operations are wrapped by the registry, so a missing MIND host has no
   * impact on the Top Navigation.
   */
  private setupMindIntegration() {
    this.setupMindContext();
    this.setupMindActions();
  }

  private setupMindContext() {
    this.updateMindLanguage = bindMindContext(mindRegistry, MindContextKey.Language, this.destroyRef, {scope: MIND_SCOPE});
    this.updateMindSiteId = bindMindContext(mindRegistry, MindContextKey.SiteId, this.destroyRef, {scope: MIND_SCOPE});
    this.updateMindSiteName = bindMindContext(mindRegistry, MindContextKey.SiteName, this.destroyRef, {scope: MIND_SCOPE});
    this.updateMindDateFormat = bindMindContext(mindRegistry, MindContextKey.DateFormat, this.destroyRef, {scope: MIND_SCOPE});
    this.updateMindTimeFormat = bindMindContext(mindRegistry, MindContextKey.TimeFormat, this.destroyRef, {scope: MIND_SCOPE});
    this.updateMindAvailableSites = bindMindContext(mindRegistry, MindContextKey.AvailableSites, this.destroyRef, {scope: MIND_SCOPE});
    const updateMindAvailableLanguages = bindMindContext(mindRegistry, MindContextKey.AvailableLanguages, this.destroyRef, {scope: MIND_SCOPE});
    const updateMindAvailableDateFormats = bindMindContext(mindRegistry, MindContextKey.AvailableDateFormats, this.destroyRef, {scope: MIND_SCOPE});
    const updateMindAvailableTimeFormats = bindMindContext(mindRegistry, MindContextKey.AvailableTimeFormats, this.destroyRef, {scope: MIND_SCOPE});

    // Seed current values.
    this.updateMindLanguage(uiStore.getState().language || this.translate.currentLang);
    const currentSite = uiStore.getState()?.site;
    this.updateMindSiteId(currentSite?.id ?? null);
    this.updateMindSiteName(currentSite?.name ?? this.selectedSite?.Name ?? null);
    const settings = userStore.getState().settings;
    this.updateMindDateFormat(settings?.dateFormat ?? null);
    this.updateMindTimeFormat(settings?.timeFormat ?? null);

    // Seed the selectable options MIND can choose from.
    updateMindAvailableLanguages(this.getAvailableLanguageOptions());
    updateMindAvailableDateFormats(this.getAvailableDateFormatOptions());
    updateMindAvailableTimeFormats(this.getAvailableTimeFormatOptions());
    this.publishAvailableSites();

    // Keep context in sync with the stores.
    this.subscription.add(
      uiStore.subscribe('language', lang => {
        this.updateMindLanguage(lang || this.translate.currentLang);
        // Language change relabels the sites, refresh the option list.
        this.publishAvailableSites();
      })
    );
    this.subscription.add(
      uiStore.subscribe('site', site => {
        this.updateMindSiteId(site?.id ?? null);
        this.updateMindSiteName(site?.name ?? null);
      })
    );
    this.subscription.add(
      userStore.subscribe('settings', newSettings => {
        this.updateMindDateFormat(newSettings?.dateFormat ?? null);
        this.updateMindTimeFormat(newSettings?.timeFormat ?? null);
      })
    );
  }

  /** Languages MIND can pass to the change-language action. */
  private getAvailableLanguageOptions(): Array<{value: string; label: string}> {
    return this.translate.getLangs().map(lang => ({
      value: lang,
      label: this.translate.instant(lang)
    }));
  }

  /** Date formats MIND can pass to the change-date/time action. */
  private getAvailableDateFormatOptions(): Array<{value: string; label: string}> {
    return [
      {
        value: UserDateFormatSettings['dd MMM yyyy'],
        label: moment().format(UserDateFormatSettings['dd MMM yyyy'].toUpperCase())
      },
      {
        value: UserDateFormatSettings['MMM dd, yyyy'],
        label: moment().format(UserDateFormatSettings['MMM dd, yyyy'].toUpperCase())
      }
    ];
  }

  /** Time formats MIND can pass to the change-date/time action. */
  private getAvailableTimeFormatOptions(): Array<{value: string; label: string}> {
    return [
      {
        value: UserTimeFormatSettings.Twelve,
        label: moment().format(UserTimeFormatSettings.Twelve).toUpperCase()
      },
      {
        value: UserTimeFormatSettings.TwentyFour,
        label: moment().format(UserTimeFormatSettings.TwentyFour)
      }
    ];
  }

  /**
   * Publishes the sites MIND can pass to the change-site action, including
   * whether each one is currently selectable for the user.
   */
  private publishAvailableSites() {
    const options = (this.sites || []).map(site => {
      const hasMinimumPermissions = this.isTrueString(site.HasMinimumPermissions);
      const isEnabled = this.isTrueString(site.IsEnable);
      return {
        value: site.SiteId,
        label: site.Name,
        selectable: hasMinimumPermissions && isEnabled,
        hasMinimumPermissions,
        isEnabled
      };
    });
    this.updateMindAvailableSites(options);
  }

  private setupMindActions() {
    // Option 1: Change language
    bindMindAction(
      mindRegistry,
      MindContextAction.ChangeLanguage,
      this.destroyRef,
      (payload: unknown): MindActionResult => {
        const language = this.extractString(payload, 'language');
        if (!language) {
          return {success: false, errorCode: 'INVALID_LANGUAGE', message: 'A language code is required.'};
        }
        const availableLangs = this.translate.getLangs();
        if (availableLangs.length && !availableLangs.includes(language)) {
          return {
            success: false,
            errorCode: 'UNSUPPORTED_LANGUAGE',
            message: `Language "${language}" is not supported. Available: ${availableLangs.join(', ')}.`
          };
        }
        this.ngZone.run(() => this.langChange(language));
        return {success: true, data: {language}};
      },
      {scope: MIND_SCOPE}
    );

    // Option 2: Change site
    bindMindAction(
      mindRegistry,
      MindContextAction.ChangeSite,
      this.destroyRef,
      (payload: unknown): MindActionResult => {
        const siteId = this.extractNumber(payload, 'siteId');
        if (typeof siteId !== 'number') {
          return {success: false, errorCode: 'INVALID_SITE', message: 'A numeric siteId is required.'};
        }
        const site = this.sites.find(el => el.SiteId === siteId);
        if (!site) {
          return {success: false, errorCode: 'SITE_NOT_FOUND', message: `Site "${siteId}" is not available for this user.`};
        }
        const hasMinimumPermissions = this.isTrueString(site.HasMinimumPermissions);
        const isEnabled = this.isTrueString(site.IsEnable);
        if (!hasMinimumPermissions || !isEnabled) {
          return {
            success: false,
            errorCode: 'SITE_NOT_ALLOWED',
            message: this.getSiteTooltip(hasMinimumPermissions, isEnabled)
          };
        }
        this.ngZone.run(() => this.siteChange(siteId, hasMinimumPermissions && isEnabled));
        return {success: true, data: {siteId, siteName: site.Name}};
      },
      {scope: MIND_SCOPE}
    );

    // Option 3: Change date/time user settings
    bindMindAction(
      mindRegistry,
      MindContextAction.ChangeDateTimeSettings,
      this.destroyRef,
      async (payload: unknown): Promise<MindActionResult> => {
        const current = userStore.getState().settings;
        const dateFormat = this.extractString(payload, 'dateFormat') ?? current?.dateFormat;
        const timeFormat = this.extractString(payload, 'timeFormat') ?? current?.timeFormat;
        if (!dateFormat || !timeFormat) {
          return {
            success: false,
            errorCode: 'INVALID_DATE_TIME_SETTINGS',
            message: 'Both dateFormat and timeFormat are required.'
          };
        }
        uiStore.setLoading('UpdateUserDateTimeFormat');
        try {
          await lastValueFrom(this.userService.updateDateTimeFormat(dateFormat, timeFormat));
          this.ngZone.run(() => {
            userStore.setDateFormat(dateFormat);
            userStore.setTimeFormat(timeFormat);
          });
          return {success: true, data: {dateFormat, timeFormat}};
        } catch (error) {
          return {
            success: false,
            errorCode: 'DATE_TIME_UPDATE_FAILED',
            message: 'Failed to update date/time settings.'
          };
        } finally {
          uiStore.removeLoading('UpdateUserDateTimeFormat');
        }
      },
      {scope: MIND_SCOPE}
    );
  }

  /**
   * Accepts either a primitive value or an object payload with the given key.
   */
  private extractString(payload: unknown, key: string): string | undefined {
    if (typeof payload === 'string' && payload.trim()) {
      return payload.trim();
    }
    if (payload && typeof payload === 'object') {
      const value = (payload as Record<string, unknown>)[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
    return undefined;
  }

  private extractNumber(payload: unknown, key: string): number | undefined {
    if (typeof payload === 'number' && !Number.isNaN(payload)) {
      return payload;
    }
    if (typeof payload === 'string' && payload.trim() && !Number.isNaN(Number(payload))) {
      return Number(payload);
    }
    if (payload && typeof payload === 'object') {
      const value = (payload as Record<string, unknown>)[key];
      if (typeof value === 'number' && !Number.isNaN(value)) {
        return value;
      }
      if (typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))) {
        return Number(value);
      }
    }
    return undefined;
  }
}
