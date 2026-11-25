/**
 * Runtime recolouring of the DCP logo.
 *
 * The logo is an <img> pointing to an SVG served by the base app, so CSS
 * variables cannot reach its gradient. When a runtime primary colour is set in
 * globalThis.__DCP_ENV__.THEME.PRIMARY_COLOR, the SVG is fetched, its two
 * brand gradient colours are replaced and the result is returned as a data URL
 * (img-src allows data:). Without a runtime colour, or on any error, the
 * original URL is returned, so the default look is unchanged.
 */

import { getRuntimeTheme } from '@open-dcp/angular-services';

// Brand gradient stops in assets/images/dcp-logo.svg (base app).
const LOGO_LIGHT_STOP = /#3883f2/gi;
const LOGO_DARK_STOP = /#1745c5/gi;

/** Converts any valid CSS colour to #rrggbb, or null if invalid/transparent. */
function toHex(color: string): string | null {
  if (!CSS.supports('color', color)) {
    return null;
  }
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) {
    return null;
  }
  ctx.fillStyle = '#000000';
  ctx.fillStyle = color;
  const result = String(ctx.fillStyle);
  return /^#[0-9a-f]{6}$/i.test(result) ? result : null;
}

/** Mixes a #rrggbb colour with white (weight = share of the colour, 0..1). */
function mixWithWhite(hex: string, weight: number): string {
  const channel = (i: number) => {
    const value = parseInt(hex.slice(i, i + 2), 16);
    return Math.round(value * weight + 255 * (1 - weight)).toString(16).padStart(2, '0');
  };
  return `#${channel(1)}${channel(3)}${channel(5)}`;
}

function getRuntimePrimaryHex(): string | null {
  const value = getRuntimeTheme()?.PRIMARY_COLOR;
  return typeof value === 'string' && value.trim() ? toHex(value.trim()) : null;
}

/** True when a runtime primary colour is set, i.e. the logo will be recoloured. */
export function hasRuntimeLogoColour(): boolean {
  return getRuntimePrimaryHex() !== null;
}

// One download/recolour per URL. Started early (bootstrap) and reused by the component,
// so the recoloured logo is usually ready before the header renders.
const logoCache = new Map<string, Promise<string>>();

export function getRuntimeLogoSrc(logoUrl: string): Promise<string> {
  let pending = logoCache.get(logoUrl);
  if (!pending) {
    pending = recolourLogo(logoUrl);
    logoCache.set(logoUrl, pending);
  }
  return pending;
}

async function recolourLogo(logoUrl: string): Promise<string> {
  const primary = getRuntimePrimaryHex();
  if (!primary) {
    return logoUrl;
  }
  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      return logoUrl;
    }
    const svg = (await response.text())
      .replace(LOGO_LIGHT_STOP, mixWithWhite(primary, 0.7))
      .replace(LOGO_DARK_STOP, primary);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } catch {
    return logoUrl;
  }
}
