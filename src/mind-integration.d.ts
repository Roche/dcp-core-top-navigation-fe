/**
 * Ambient type declarations for `@open-dcp/mind-integration`.
 *
 * The project uses classic `moduleResolution: "node"`, which does not honor the
 * package's `exports` subpath map (`/angular`) nor its internal `.js`-extension
 * declaration imports. Webpack resolves the modules correctly at runtime; these
 * ambient declarations provide the matching types for the TypeScript compiler.
 *
 * Keep in sync with node_modules/@open-dcp/mind-integration/dist/*.d.ts
 */

declare module '@open-dcp/mind-integration' {
  export type MindContextSnapshot = Record<string, unknown>;
  export type MindActionFn = (...args: unknown[]) => unknown | Promise<unknown>;

  export interface MindActionResult {
    success: boolean;
    errorCode?: string;
    message?: string;
    data?: unknown;
  }

  export interface MindActionValidationFailure {
    errorCode?: string;
    message?: string;
  }

  export type MindActionValidatorResult = boolean | string | MindActionValidationFailure;
  export type MindActionValidator = (args: unknown[]) => MindActionValidatorResult | Promise<MindActionValidatorResult>;

  export interface MindActionOptions {
    scope?: string;
    timeoutMs?: number;
    validate?: MindActionValidator;
  }

  export interface MindContextRegistryOptions {
    defaultActionTimeoutMs?: number;
  }

  export type MindActionInvoker = (...args: unknown[]) => Promise<MindActionResult>;
  export type MindContextChangeListener = (snapshot: MindContextSnapshot) => void;

  export interface MindContextChangeEvent {
    snapshot: MindContextSnapshot;
    changedKeys: string[];
  }

  export type MindContextKeyChangeListener = (value: unknown, event: MindContextChangeEvent) => void;

  export interface MindContextRegistry {
    set(key: string, value: unknown, scope?: string): void;
    clear(key: string): void;
    clearScope(scope: string): void;
    clearAll(): void;
    resetContext(scope?: string): void;
    snapshot(): MindContextSnapshot;
    subscribe(listener: MindContextChangeListener): () => void;
    subscribeKey(keys: string | string[], listener: MindContextKeyChangeListener): () => void;
    registerAction(name: string, fn: MindActionFn, options?: MindActionOptions): void;
    unregisterAction(name: string): void;
    resetActions(scope?: string): void;
    resetAll(): void;
    invokeAction(name: string, args?: unknown[]): Promise<MindActionResult>;
    listActions(): string[];
  }

  export function createMindContextRegistry(appName: string, options?: MindContextRegistryOptions): MindContextRegistry;
}

declare module '@open-dcp/mind-integration/angular' {
  import {
    MindContextRegistry,
    MindActionFn,
    MindActionOptions
  } from '@open-dcp/mind-integration';

  export interface AngularMindContextOptions {
    scope?: string;
  }

  export function bindMindContext(
    registry: MindContextRegistry,
    key: string,
    destroyRef: { onDestroy(fn: () => void): void },
    options?: AngularMindContextOptions
  ): (value: unknown) => void;

  export function bindMindAction(
    registry: MindContextRegistry,
    name: string,
    destroyRef: { onDestroy(fn: () => void): void },
    fn: MindActionFn,
    options?: MindActionOptions
  ): void;
}

