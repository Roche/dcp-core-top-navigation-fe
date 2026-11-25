import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

interface ImportMapOverrideState {
  activeCount: number;
  disabledCount: number;
  differenceCount: number;
  hasOverrides: boolean;
}

/**
 * Service to monitor import-map overrides in localStorage
 * Tracks active overrides vs. disabled overrides
 */
@Injectable({
  providedIn: 'root'
})
export class ImportMapOverrideService {

  private readonly IMPORT_MAP_PREFIX = 'import-map-override:';
  private readonly IMPORT_MAP_DISABLED_KEY = 'import-map-overrides-disabled';

  // Observable that emits the override state calculated once on load
  private overrideStateSubject$ = new BehaviorSubject<ImportMapOverrideState>(this.calculateState());

  /**
   * Public observable to subscribe to import-map override state changes
   */
  public overrideState$: Observable<ImportMapOverrideState> = this.overrideStateSubject$.asObservable();

  /**
   * Get badge count (difference between active and disabled overrides)
   */
  public badgeCount$: Observable<number> = this.overrideState$.pipe(
    map(state => state.differenceCount)
  );

  /**
   * Whether there are any active overrides
   */
  public hasActiveOverrides$: Observable<boolean> = this.overrideState$.pipe(
    map(state => state.hasOverrides)
  );

  constructor() {
    // Note: Import-map overrides require a page refresh to take effect,
    // so polling is unnecessary. State is calculated once on load.
  }

  /**
   * Calculate the current state of import-map overrides
   * @private
   */
  private calculateState(): ImportMapOverrideState {
    const activeOverrides = this.getActiveOverrides();
    const disabledOverrides = this.getDisabledOverrides();

    const activeCount = activeOverrides.length;
    const disabledCount = disabledOverrides.length;
    const differenceCount = activeCount - disabledCount;

    return {
      activeCount,
      disabledCount,
      differenceCount: differenceCount > 0 ? differenceCount : 0,
      hasOverrides: activeCount > 0
    };
  }

  /**
   * Get list of active import-map overrides from localStorage
   * @private
   */
  private getActiveOverrides(): string[] {
    const keys: string[] = [];

    // Iterate through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.IMPORT_MAP_PREFIX)) {
        keys.push(key);
      }
    }

    return keys;
  }

  /**
   * Get list of disabled import-map overrides from localStorage
   * @private
   */
  private getDisabledOverrides(): string[] {
    try {
      const disabledJson = localStorage.getItem(this.IMPORT_MAP_DISABLED_KEY);
      if (!disabledJson) {
        return [];
      }

      const parsed = JSON.parse(disabledJson);
      // Ensure we have an array
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to parse import-map-overrides-disabled', error);
      return [];
    }
  }

  /**
   * Manual trigger to recalculate state (useful if needed from components)
   */
  public refreshState(): void {
    this.overrideStateSubject$.next(this.calculateState());
  }
}

