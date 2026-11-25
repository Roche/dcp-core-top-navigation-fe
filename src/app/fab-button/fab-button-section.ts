import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewEncapsulation} from "@angular/core";
import {DOCUMENT, NgClass, NgIf, AsyncPipe} from "@angular/common";
import {OnDestroySubject} from "@open-dcp/angular-services";
import {takeUntil} from "rxjs";
import {DefaultButtonComponent} from "@open-dcp/angular-basic-components";
import {MatIcon} from "@angular/material/icon";
import {MatMiniFabButton} from "@angular/material/button";
import {MatBadge} from "@angular/material/badge";
import {ParcelService} from "../shared/parcel.service";
import {ImportMapOverrideService} from "../shared/import-map-override.service";
import {ParcelConfig} from "single-spa";
import {AppFabParcelElementComponent} from "./fab-parcel-element.component";

interface FabSectionParcel {
  "type": string,
  "name": string,
  "zone": 'fabButtonsSection',
  "importName": string,
  "order": number
}

interface ResolvedFabParcel {
  order: number;
  config: ParcelConfig;
  visible: boolean;
  index: number;
}
@Component({
  selector: "app-fab-button-section",
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    AppFabParcelElementComponent,
    MatMiniFabButton,
    MatIcon,
    MatBadge,
    NgClass,
    DefaultButtonComponent,
  ],
  template: `
    <div class="fab-button_section"
         *ngIf="shouldShowMenu"
         [ngClass]="{'fab-button_section--active': triggerActive}">

      @for (parcel of parcels; track parcel.config) {
        <app-fab-parcel-element
          [parcelConfig]="parcel.config"
          [triggerActive]="triggerActive"
          (visibilityChange)="onVisibilityChange($event, parcel.index)">
        </app-fab-parcel-element>
      }

      @if (overrideMenuButton) {
        <div class="fab-button_element"
             [ngClass]="{'fab-button_element--active': triggerActive}">
          <div class="fab-button_imo-wrapper"
               [matBadge]="badgeCount$ | async"
               matBadgeSize="small"
               matBadgeColor="warn"
               [matBadgeHidden]="!(badgeCount$ | async)">
            <odcp-default-button
              color="accent"
              (click)="overrideMenuButton.click()">Import maps</odcp-default-button>
          </div>
        </div>
      }

      <button mat-mini-fab
              [ngClass]="{
                'fab-button_trigger--active': triggerActive
              }"
              color="primary"
              [matBadge]="badgeCount$ | async"
              matBadgeSize="small"
              matBadgeColor="warn"
              [matBadgeHidden]="!(badgeCount$ | async)"
              (click)="toggle()"
              class="fab-button_trigger">
        <mat-icon>add</mat-icon>
      </button>
    </div>`,
  styleUrl: './fab-button-section.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppFabButtonSection extends OnDestroySubject implements OnInit, OnDestroy, AfterViewInit {

  parcels: ResolvedFabParcel[] = [];

  overrideMenuButton: HTMLElement | null = null;

  triggerActive = false;

  toggleTimeout;

  badgeCount$ = this.importMapOverrideService.badgeCount$;

  constructor(
    private readonly parcelService: ParcelService,
    private readonly importMapOverrideService: ImportMapOverrideService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit() {
    this.loadParcels();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    clearTimeout(this.toggleTimeout);
  }
  /**
   * Post-render check for 'devtools' in localStorage.
   * If enabled, captures the `.imo-trigger` element to include in the FAB menu.
   */
  ngAfterViewInit() {
    // Defer DOM-derived state updates to the next tick to avoid NG0100 in dev mode.
    setTimeout(() => {
      const overrideActive = JSON.parse(localStorage.getItem('devtools'));
      if (!overrideActive) {
        return;
      }

      const imoTriggerButton = this.document.getElementsByClassName('imo-trigger')[0] as HTMLElement | undefined;
      if (imoTriggerButton) {
        this.overrideMenuButton = imoTriggerButton;
      }
    });
  }
  /**
   * @getter shouldShowMenu
   * @returns {boolean} True if there is at least one visible parcel or an active devtools button.
   */
  get shouldShowMenu(): boolean {
    return (this.parcels.length > 0 && this.parcels.some(el => el.visible)) || !!this.overrideMenuButton;
  }

  /**
   * Subscribes to the parcel stream, filters for the 'fabButtonsSection' zone,
   * and dynamically imports the modules using SystemJS.
   * @private
   */
  private loadParcels() {
    this.parcelService.parcels$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(async (parcels: FabSectionParcel[]) => {
        const fabSecionParcels: FabSectionParcel[] = parcels
          .filter(data => data.type === 'parcel' && data.zone === 'fabButtonsSection');

        const resolvedParcels = await Promise.all(
          fabSecionParcels.map(async (parcel) => {
            const moduleApp = await System.import(parcel.importName);
            if (!moduleApp[parcel.name]) {
              return null;
            }

            return {
              order: parcel.order,
              config: moduleApp[parcel.name],
              visible: true,
              index: 0 // Will be updated after sorting
            };
          })
        );

        const sortedParcels = resolvedParcels
          .filter((item): item is ResolvedFabParcel => !!item)
          .sort((a, b) => b.order - a.order)
          .map((item, index) => ({...item, index}));

        this.parcels = sortedParcels;
      });
  }
  /**
   * Updates the visibility status of a specific parcel based on its internal state.
   * @param {boolean} visible Whether the parcel should be rendered.
   * @param {number} index The index of the parcel in the local array.
   * @private
   */
  onVisibilityChange(visible: boolean, index: number) {
    if (this.parcels[index]) {
      this.parcels[index].visible = visible;
    }
  }
  /**
   * Toggles the menu state and starts a 5-second countdown to automatically
   * collapse the menu if it was opened.
   */
  toggle() {
    clearTimeout(this.toggleTimeout);
    this.triggerActive = !this.triggerActive;

    if (this.triggerActive) {
      this.toggleTimeout = setTimeout(() => {
        if (this.triggerActive) {
          this.triggerActive = false;
        }
      }, 5000)
    }
  }
}
