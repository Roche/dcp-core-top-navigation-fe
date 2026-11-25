import {createMindContextRegistry, MindContextRegistry} from '@open-dcp/mind-integration';

/**
 * App name under which the Top Navigation registers itself in
 * `window.__DCP_MIND_CONTEXT__`. MIND reads context and invokes actions
 * through this entry.
 */
export const MIND_APP_NAME = '@dcp/top-navigation';

/** Context scope used to group all Top Navigation keys/actions. */
export const MIND_SCOPE = 'topNavigation';

/** Context keys published by the Top Navigation (app -> MIND). */
export const MindContextKey = {
  Language: `${MIND_SCOPE}:language`,
  SiteId: `${MIND_SCOPE}:siteId`,
  SiteName: `${MIND_SCOPE}:siteName`,
  DateFormat: `${MIND_SCOPE}:dateFormat`,
  TimeFormat: `${MIND_SCOPE}:timeFormat`,
  // Available options MIND can choose from when invoking the actions below.
  AvailableLanguages: `${MIND_SCOPE}:availableLanguages`,
  AvailableSites: `${MIND_SCOPE}:availableSites`,
  AvailableDateFormats: `${MIND_SCOPE}:availableDateFormats`,
  AvailableTimeFormats: `${MIND_SCOPE}:availableTimeFormats`,
} as const;

/** Actions exposed to MIND (MIND -> app). These are the selectable "options". */
export const MindContextAction = {
  ChangeLanguage: `${MIND_SCOPE}:changeLanguage`,
  ChangeSite: `${MIND_SCOPE}:changeSite`,
  ChangeDateTimeSettings: `${MIND_SCOPE}:changeDateTimeSettings`,
} as const;

/**
 * Single registry instance for the Top Navigation app. Creation is safe even
 * when MIND is absent — a silent no-op registry is returned on failure.
 */
export const mindRegistry: MindContextRegistry = createMindContextRegistry(MIND_APP_NAME, {
  defaultActionTimeoutMs: 5000,
});

