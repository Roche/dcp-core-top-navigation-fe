import { HttpClient } from '@angular/common/http';
import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, lastValueFrom, Observable} from 'rxjs';
import {AdUserModel} from './user.model';
import {DcHttp} from "@open-dcp/angular-services";
import {uiStore, userStore} from "@open-dcp/services";
import {Idle} from "@ng-idle/core";
import {Router} from "@angular/router";
import {SharedConstants} from './shared-constant';

export interface ActiveModulesModel {
  ID: number;
  ModuleName: string;
  RConnection: string;
  SiteID: number;
  IsEnable: boolean;
  IsValidated: boolean;
  DataType?: {
    DataTypeId: number;
    DataType: number;
    DataSourceId: number;
  }[];
}

@Injectable()
export class UserService implements OnDestroy {

  private refreshTokenTimeout;

  public roles = new BehaviorSubject<string[]>([]);

  constructor(
    private readonly http: DcHttp,
    private readonly httpClient: HttpClient,
    private readonly idle: Idle,
    private readonly router: Router
  ) {}

  ngOnDestroy() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }
  /**
   * Obsolete method used in Core V1 applications to change Site Context.
   * To be removed when all applications start to use v2 and Top Navigation
   * @private
   */
  changeSiteInCoreV1() {
    if (!uiStore.getState().site.id) {
      return;
    }
    uiStore.setLoading('changeSiteCoreV1');
    lastValueFrom(this.changeSite(uiStore.getState().site.id))
      .finally(() => {
        uiStore.removeLoading('changeSiteCoreV1');
      });
  }

  private refreshToken(): Observable<AdUserModel> {
    const {refreshToken} = userStore.getState();
    const loginParams = `grant_type=refresh_token&refresh_token=${refreshToken}`;
    return this.httpClient.post(`${this.http.gatewayModuleUrl('core')}/v2/token?${loginParams}`, {}) as Observable<AdUserModel>;
  }


  logoutAndRedirect() {
    sessionStorage.setItem(SharedConstants.logoutInProgressKey, 'true');
    uiStore.setLoading('logout');
    lastValueFrom(this.logout())
      .then(res => {
        userStore.setToken('');
        userStore.setRefreshToken('');
        if (res) {
          window.location.href = res;
        } else {
          history.pushState(null, '', '/login');
        }
        localStorage.removeItem('user');
      })
      .catch(() => {
        userStore.setToken('');
        userStore.setRefreshToken('');
        history.pushState(null, '', '/login');
        localStorage.removeItem('user');
      })
      .finally(() => {
        uiStore.removeLoading('logout');
      });
  }

  private logout(): Observable<string> {
    const siteId = uiStore.getState().site.id;
    return this.http.get(`${this.http.gatewayModuleUrl('core')}/v2/sign-out${siteId ? '?siteId=' + siteId : ''}`);
  }

  updateDateTimeFormat(dateFormat: string, timeFormat: string): Observable<any> {
    return this.http.put(
      `${this.http.gatewayModuleUrl('core')}/v2/user/settings`,
      {
        DateFormat: dateFormat,
        TimeFormat: timeFormat,
      }
    );
  }

  triggerRefreshToken() {
    if (this.idle.isIdling()) {
      return;
    }
    clearTimeout(this.refreshTokenTimeout);
    uiStore.setLoading('refreshToken');
    lastValueFrom(this.refreshToken())
      .then(res => {
        userStore.setToken(res.access_token);
        userStore.setRefreshToken(res.refresh_token);
        this.setTimeoutForRefreshToken(res.access_token);
      })
      .catch(() => {
        this.logout();
      })
      .finally(() => {
        uiStore.removeLoading('refreshToken');
      });

  }

  setTimeoutForRefreshToken(accessToken: string) {
    const {exp} = this.decodeAccessToken(accessToken) as undefined as {exp: number};
    const expirationInMilliseconds = new Date(exp * 1000).getTime() - new Date().getTime();
    const triggerBeforeInMs = 30
    if (expirationInMilliseconds <= triggerBeforeInMs) {
      this.triggerRefreshToken();
      return;
    }
    this.refreshTokenTimeout = setTimeout(() => {
      this.triggerRefreshToken();
      clearTimeout(this.refreshTokenTimeout);
    }, expirationInMilliseconds - triggerBeforeInMs);
  }

  private readonly parseJwt = (token: string) =>  {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  private readonly decodeAccessToken = (accessToken: string) => {
    return this.parseJwt(accessToken) as AdUserModel;
  }

  getSiteModules(siteId: number) {
    return this.http.get(`${this.http.gatewayModuleUrl('core')}/v2/site/${siteId}/modules`);
  }


  /**
   * Method to be removed when all applications start to use Core v2 flow with Top Navigation implementation
   * @param id - site ID that need to be
   */
  changeSite(id: number): Observable<ActiveModulesModel[]> {
    return this.http.put(`${this.http.gatewayModuleUrl('core')}/v2/user/site/set?siteId=${id}`, {});
  }
}
