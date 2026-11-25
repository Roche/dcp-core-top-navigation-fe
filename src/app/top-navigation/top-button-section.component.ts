import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {OnDestroySubject} from '@open-dcp/angular-services';
import {uiStore} from '@open-dcp/services';
import {BehaviorSubject, takeUntil} from 'rxjs';
import {ParcelService} from '../shared/parcel.service';
import {ParcelConfig} from 'single-spa';
import {AppTopParcelElementComponent} from './top-parcel-element.component';
import {SharedConstants} from '../shared/shared-constant';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';

interface TopSectionParcel {
  type: string,
  name: string,
  zone: 'topButtonsSection',
  importName: string,
  order: number
}

interface ResolvedTopParcel {
  id: string;
  order: number;
  config: ParcelConfig;
}

/**
 * @component AppTopButtonSectionComponent
 * @extends OnDestroySubject
 * @description
 * A layout component responsible for rendering a horizontal sequence of micro-frontend parcels
 * within the 'topButtonsSection' zone.
 * * This component renders parcels immediately in a flex container,
 * typically used for header actions, global search bars, or user profile fragments.
 * * @usage Notes:
 * - Uses SystemJS to import remote modules at runtime.
 * - Automatically cleans up subscriptions via the `OnDestroySubject` base class.
 * - Provides its own instance of `ParcelService` via the `providers` array.
 */
@Component({
  selector: 'app-top-button-section',
  standalone: true,
  imports: [
    AppTopParcelElementComponent,
    NgIf,
    RouterLink,
    MatIcon,
    MatIconButton,
    MatTooltip,
    TranslateModule
  ],
  providers: [
    ParcelService
  ],
  template: `
    <ng-container *ngIf="!hasTopButtonsMetadata && siteContext$.value">
      <button mat-icon-button
              class="mr-3 color-primary d-flex align-items-center justify-content-center"
              [routerLink]="[sharedConstants.appUrlSection + siteContext$.value + '/my-favorites']"
              [matTooltip]="'MY_FAVOURITES_LINK' | translate">
        <mat-icon>star_border</mat-icon>
      </button>
    </ng-container>

    @for (parcel of parcels; track parcel.id) {
      <span class="mr-3">
        <app-top-parcel-element
          [parcelConfig]="parcel.config"
          [instanceId]="parcel.id">
        </app-top-parcel-element>
      </span>
    }
  `,
  styles: `:host {
    display: flex;
    align-items: center;
  }
  /* Scoped so other apps' global .color-primary cannot override the runtime colour. */
  .color-primary {
    color: var(--dcp-branding-primary-color, #0066cc) !important;
  }`
})
export class AppTopButtonSectionComponent extends OnDestroySubject implements OnInit, OnDestroy {

  parcels: ResolvedTopParcel[] = [];

  // Temporary fallback: remove when Favorites parcel is available on PROD.
  hasTopButtonsMetadata = false;

  siteContext$ = new BehaviorSubject<number>(uiStore.getState()?.site?.id);

  sharedConstants = SharedConstants;

  private unsubscribeSiteStore: (() => void) | null = null;

  constructor(
    private readonly parcelService: ParcelService,
    private readonly ngZone: NgZone
  ) {
    super();
  }

  ngOnInit() {
    this.subscribeToSiteContext();
    this.loadParcels();
  }

  ngOnDestroy() {
    this.unsubscribeSiteStore?.();
    super.ngOnDestroy();
  }

  private subscribeToSiteContext() {
    this.unsubscribeSiteStore = uiStore.subscribe('site', site => {
      this.ngZone.run(() => {
        this.siteContext$.next(site?.id);
      });
    });
  }

  /**
   * Subscribes to the parcel stream and filters for items matching the 'topButtonsSection' zone.
   * * Logic:
   * 1. Filters for type 'parcel' and zone 'topButtonsSection'.
   * 2. Uses SystemJS (`System.import`) to fetch the remote entry point.
   * 3. Locates the specific exported parcel by name.
   * 4. Resolves all parcels and sorts by order index descending.
   * * @private
   * @returns {void}
   */
  private loadParcels() {
    this.parcelService.parcels$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(async (parcels: TopSectionParcel[]) => {
        const topSectionParcels: TopSectionParcel[] = parcels
          .filter(data => data.type === 'parcel' && data.zone === 'topButtonsSection');

        // Fallback should be shown only when there is no metadata for this zone.
        this.hasTopButtonsMetadata = topSectionParcels.length > 0;

        const resolvedParcels = await Promise.all(
          topSectionParcels.map(async (parcel, index) => {
            const moduleApp = await System.import(parcel.importName);
            if (!moduleApp[parcel.name]) {
              return null;
            }

            return {
              // Keep each rendered item unique even for same import/export pairs.
              id: `${parcel.importName}::${parcel.name}::${parcel.order}::${index}`,
              order: parcel.order,
              // Clone config to avoid shared reference collisions across repeated mounts.
              config: {...moduleApp[parcel.name]} as ParcelConfig
            };
          })
        );

        this.parcels = resolvedParcels
          .filter((item): item is ResolvedTopParcel => !!item)
          .sort((a, b) => b.order - a.order);
      });
  }
}
