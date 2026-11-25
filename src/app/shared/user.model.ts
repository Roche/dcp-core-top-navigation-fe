export interface UserModel {
  UserID: number;
  UserName: string;
  FirstName?: string;
  LastName?: string;
  DisplayName: string;
  Groups: any[];
  Permissions: PermissionModel[];
  PermissionsText: string;
}

export interface AdUserModel {
  uid?: string;
  userName: string;
  access_token: string;
  domain: string;
  displayName: string;
  permissions?: UserPermissionModel[];
  sites?: UserSiteModel[];
  roles: string[];
  loading?: boolean;
  error?: string;
  expires_in?: number;
  error_description?: string;
  refresh_token: string;
  timeDifference?: number;
  isGlobalAdmin: string;
  isGlobalApiUser: string;
  dateFormat?: string;
  timeFormat?: string;
  currentLoggedUserId?: string;
  userId?: number;
}
export interface PermissionModel {
  Key: number;
  Value: string;
}
export interface UserSettingsModel {
  timeFormat: string;
  dateFormat: string;
}

export enum UserTimeFormatSettings {
  TwentyFour = 'HH:mm:ss',
  Twelve = 'hh:mm:ss a'
}

export enum UserDateFormatSettings {
  'MMM dd, yyyy' = 'MMM dd, yyyy',
  'dd MMM yyyy' = 'dd MMM yyyy',
}

export enum UserDateFormatMoment {
  'MMM dd, yyyy' = 'MMM DD, YYYY',
  'dd MMM yyyy' = 'DD MMM YYYY',
}

export interface UserPermissionModel {
  Permission: string;
  SiteId: number;
  SiteName: string;
  Module: string;
}

export interface UserSiteModel {
  Name: string;
  ShortName: string;
  SiteId: number;
  TimeZone: string;
  IsEnable: boolean;
  SiteType: number;
  Modules: any;
  DataSources: any;
}
