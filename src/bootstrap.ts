import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router, NavigationStart } from '@angular/router';
import { AppModule } from './app/app.module';
import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { environment } from './environments/environment';
import '@angular/localize/init';
import { getRuntimeLogoSrc, hasRuntimeLogoColour } from './app/shared/runtime-logo';
import { gxpStoreRegistration, StoreRegistrationResult, uiStore, uiStoreRegistration, userStoreRegistration } from '@open-dcp/services';
import { applyRuntimeTheme } from '@open-dcp/angular-services';
import { AppConfig, appConfigLoader } from './app/shared/config/app-config';

applyRuntimeTheme({ logPrefix: '[Top-navigation]' });

type RegistrationEnvelope = {
  registration: StoreRegistrationResult;
};

export async function initializeRegistrationState(
  registrationPromise: Promise<RegistrationEnvelope>
): Promise<void> {
  const { registration } = await registrationPromise;

  if (registration.status === 'rejected-incompatible-downgrade' ||
    registration.status === 'rejected-incompatible-upgrade') {
    throw new Error(`[Top-navigation] Incompatible registration (${registration.status})`);
  }
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, name: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`[Top-navigation] ${name} exceeded timeout of ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

let registrationBootstrapStarted = false;

async function registrationInitializerFactory() {
  const registrationTasks = [
    withTimeout(initializeRegistrationState(uiStoreRegistration), 1000, 'UI Store Registration'),
    withTimeout(initializeRegistrationState(userStoreRegistration), 1000, 'User Store Registration'),
    withTimeout(initializeRegistrationState(gxpStoreRegistration), 1000, 'GXP Store Registration'),
  ];

  await Promise.all(
    registrationTasks.map(task =>
      task.catch(error => {
        console.error('[Top-navigation] Registration initialization failed:', error);
        return undefined;
      })
    )
  );
}

let persistentAppRoot: Element | null = null;

function readRoutingUrls(event: Event): { oldUrl: string | null; newUrl: string | null } {
  const eventWithDetail = event as Event & {
    detail?: {
      oldUrl?: string;
      newUrl?: string;
    };
  };

  return {
    oldUrl: eventWithDetail.detail?.oldUrl ?? null,
    newUrl: eventWithDetail.detail?.newUrl ?? null
  };
}

function getPathSegments(url: string | null): string[] {
  if (!url) {
    return [];
  }

  try {
    return new URL(url, window.location.origin)
      .pathname
      .split('/')
      .filter(Boolean);
  } catch {
    // Fallback for malformed values that are still path-like.
    return url.split('?')[0].split('#')[0].split('/').filter(Boolean);
  }
}

function shouldSkipDomMoveForNavigation(oldUrl: string | null, newUrl: string | null): boolean {
  const oldSegments = getPathSegments(oldUrl);
  const newSegments = getPathSegments(newUrl);

  if (!oldSegments.length || !newSegments.length) {
    return false;
  }

  const oldAppIndex = oldSegments.indexOf('app');
  const newAppIndex = newSegments.indexOf('app');

  if (oldAppIndex < 0 || oldAppIndex !== newAppIndex) {
    return false;
  }

  const sectionOffsetFromApp = 2;
  const oldSection = oldSegments[oldAppIndex + sectionOffsetFromApp];
  const newSection = newSegments[newAppIndex + sectionOffsetFromApp];
  return !!oldSection && oldSection === newSection;
}

function syncAppRootPosition() {
  // Always query document if persistentAppRoot was destroyed or detached
  if (!persistentAppRoot || !document.contains(persistentAppRoot)) {
    persistentAppRoot = document.querySelector('app-top-navigation-root');
  }

  if (!persistentAppRoot) {
    return;
  }

  const activeContainer =
    document.querySelector('.wrapper .top-navigation') ||
    document.querySelector('header.top-navigation') ||
    document.querySelector('.top-navigation');

  if (activeContainer) {
    if (!activeContainer.contains(persistentAppRoot)) {
      activeContainer.appendChild(persistentAppRoot);
    }
  } else {
    document.body.appendChild(persistentAppRoot);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('single-spa:routing-event', () => {
    setTimeout(() => {
      syncAppRootPosition();
    }, 0);
  });

  window.addEventListener('single-spa:before-routing-event', (event) => {
    const { oldUrl, newUrl } = readRoutingUrls(event);

    if (shouldSkipDomMoveForNavigation(oldUrl, newUrl)) {
      return;
    }

    if (persistentAppRoot && document.contains(persistentAppRoot)) {
      document.body.appendChild(persistentAppRoot);
    }
  });
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: async singleSpaProps => {
    let config: AppConfig;
    try {
      config = await appConfigLoader.load();
    } catch (error) {
      const message = uiStore.getState()?.language === 'de'
        ? 'Die Laufzeitkonfiguration konnte nicht geladen werden.'
        : 'The runtime configuration could not be loaded.';
      try {
        uiStore.setMessage('error', message);
      } catch (notificationError) {
        console.error('[Top-navigation] Could not notify about runtime config failure:', notificationError);
      }
      throw error;
    }

    if (config.production) {
      enableProdMode();
    }

    // Start recolouring the host-owned DCP logo before the header renders.
    if (hasRuntimeLogoColour()) {
      getRuntimeLogoSrc(config.baseAppUrl + 'assets/images/dcp-logo.svg');
    }

    applyRuntimeTheme({ logPrefix: '[Top-navigation]' });
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
  },
  domElementGetter: (props: any) => {
    if (props && typeof props.domElementGetter === 'function') {
      const el = props.domElementGetter();
      if (el) return el;
    }
    return document.querySelector('.wrapper .top-navigation') || document.querySelector('.top-navigation') || document.body;
  },
  template: `<app-top-navigation-root class="dc-app-root" data-angular="${environment.angularVersion}"></app-top-navigation-root>`,
  Router,
  NavigationStart,
  NgZone
});

async function executeLifecycle(lifecycle: unknown, props: unknown): Promise<unknown> {
  if (Array.isArray(lifecycle)) {
    return lifecycle.reduce((chain, fn) => chain.then(() => fn(props)), Promise.resolve());
  }
  if (typeof lifecycle === 'function') {
    return lifecycle(props);
  }
  return Promise.resolve();
}

export const bootstrap = async (props: any): Promise<void> => {
  if (!registrationBootstrapStarted) {
    registrationBootstrapStarted = true;
    void registrationInitializerFactory();
  }

  return executeLifecycle(lifecycles.bootstrap, props) as Promise<void>;
};

export const mount = async (props: any) => {
  let retries = 10;
  while (retries > 0) {
    const container = props && typeof props.domElementGetter === 'function'
      ? props.domElementGetter()
      : document.querySelector('.top-navigation');

    if (container) {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 50));
    retries--;
  }

  const result = await executeLifecycle(lifecycles.mount, props);
  // Reset cached root on new mount so it grabs the newly instantiated component
  persistentAppRoot = document.querySelector('app-top-navigation-root');
  syncAppRootPosition();
  return result;
};

export const unmount = async (props: any) => {
  try {
    const result = await executeLifecycle(lifecycles.unmount, props);
    // Clear reference on complete unmount
    persistentAppRoot = null;
    return result;
  } catch (err) {
    persistentAppRoot = null;
    return Promise.resolve();
  }
};
