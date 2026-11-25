import {
  createRuntimeConfigLoader,
  DcpRuntimeConfig,
  parseRuntimeConfig
} from '@open-dcp/angular-services';
import { publicPathUrl } from '../../../single-spa/asset-url';

export interface AppConfig extends DcpRuntimeConfig {
  helpUrl?: string;
  mailUrl?: string;
  issueUrl?: string;
}

export function parseAppConfig(raw: unknown, source: string): AppConfig {
  const config = parseRuntimeConfig(raw, source);
  const rawConfig = raw as Record<string, unknown>;
  const optionalString = (key: string): string | undefined => {
    const value = rawConfig[key];
    if (value === undefined) {
      return undefined;
    }
    if (typeof value !== 'string') {
      throw new Error(`[RuntimeConfig] Invalid runtime config in ${source}: ${key} must be a string.`);
    }
    return value;
  };

  const helpUrl = optionalString('helpUrl');
  const mailUrl = optionalString('mailUrl');
  const issueUrl = optionalString('issueUrl');

  return {
    ...config,
    ...(helpUrl !== undefined ? { helpUrl } : {}),
    ...(mailUrl !== undefined ? { mailUrl } : {}),
    ...(issueUrl !== undefined ? { issueUrl } : {})
  };
}

/**
 * Loads `config.json` from the bundle's own folder (see CONFIG.md). The URL is resolved on load(),
 * after src/single-spa/set-public-path.ts has set the webpack public path.
 */
export const appConfigLoader = createRuntimeConfigLoader(
  () => publicPathUrl('config.json'),
  parseAppConfig
);
