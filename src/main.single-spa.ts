import './single-spa/set-public-path';

/**
 * Async bootstrap entry point for Module Federation.
 *
 * The dynamic import() below creates an async boundary that allows webpack's
 * Module Federation runtime to negotiate which shared module instances to use
 * (e.g. @angular/core, rxjs, @open-dcp/services) BEFORE any application code
 * that actually imports those packages is executed.
 *
 * Without this boundary you get:
 *   "Shared module is not available for eager consumption"
 *
 * We export real wrapper functions (not undefined variables) so single-spa
 * always gets callable references. Each wrapper waits for the dynamic import
 * to resolve, then delegates to the real lifecycle function.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lifecyclePromise: Promise<typeof import('./bootstrap')> = import('./bootstrap');

/**
 * Per-application single-spa timeout configuration.
 *
 * single-spa reads a `timeouts` export from an application's lifecycle module
 * and uses it to override the global lifecycle timeouts for THIS app only.
 * See https://single-spa.js.org/docs/api#configuration-options and error #31.
 *
 * The Angular bootstrap for this shell (platformBrowserDynamic().bootstrapModule)
 * plus the store registration negotiation can legitimately exceed the default
 * 4000ms warning threshold on slower environments. We raise the threshold and
 * keep `dieOnTimeout: false` so single-spa waits for the promise to settle
 * instead of logging the #31 warning / tearing the app down.
 */
export const timeouts = {
  bootstrap: {
    millis: 20000,
    dieOnTimeout: false,
    warningMillis: 20000,
  },
  mount: {
    millis: 20000,
    dieOnTimeout: false,
    warningMillis: 20000,
  },
  unmount: {
    millis: 20000,
    dieOnTimeout: false,
    warningMillis: 20000,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function bootstrap(props: any): Promise<void> {
  return lifecyclePromise.then(m => (m.bootstrap as (p: unknown) => Promise<void>)(props));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mount(props: any): Promise<void> {
  return lifecyclePromise.then(m => (m.mount as (p: unknown) => Promise<void>)(props));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unmount(props: any): Promise<void> {
  return lifecyclePromise.then(m => (m.unmount as (p: unknown) => Promise<void>)(props));
}
