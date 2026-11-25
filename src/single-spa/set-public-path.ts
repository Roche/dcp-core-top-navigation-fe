// Sets the webpack public path at runtime to the folder main.js was loaded from, so lazy chunks, assets and
// config.json are loaded next to the bundle in every environment without a build-time deployUrl.
// Keep this first import free of federated dependencies: their chunks need the public path to be set already.
declare let __webpack_public_path__: string;

/** Import-map name of this app (see module-settings/app-data.json). */
const IMPORT_MAP_NAME = '@dcp/top-navigation';

const system = (globalThis as { System?: { resolve(id: string): string } }).System;
if (typeof system?.resolve !== 'function') {
  throw new Error(`[RuntimeConfig] SystemJS is not available, cannot resolve the public path of ${IMPORT_MAP_NAME}.`);
}

const resolvedEntryUrl = system.resolve(IMPORT_MAP_NAME);
const publicPath = new URL('.', resolvedEntryUrl).href;
__webpack_public_path__ = publicPath;

console.info('[Top-navigation] Runtime public path', {
  importName: IMPORT_MAP_NAME,
  resolvedEntryUrl,
  publicPath,
  pageUrl: typeof window === 'undefined' ? undefined : window.location.href
});
