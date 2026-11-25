import {Component, OnDestroy, OnInit} from "@angular/core";
import {NgFor, NgIf} from "@angular/common";
import {OnDestroySubject} from "@open-dcp/angular-services";
import {takeUntil} from "rxjs";
import {ParcelService} from "../shared/parcel.service";
import {ParcelConfig} from "single-spa";
import {AppAuxiliaryParcelElementComponent} from "./auxiliary-parcel-element.component";
import {AppFabButtonSection} from "../fab-button/fab-button-section";

interface AuxiliarySectionParcel {
  type: string;
  name: string;
  zone: 'auxiliaryButtonsSection';
  importName: string;
  order: number;
}

interface ResolvedParcel {
  order: number;
  config: ParcelConfig;
}

@Component({
  selector: "app-auxiliary-section",
  standalone: true,
  imports: [
    AppAuxiliaryParcelElementComponent,
    AppFabButtonSection
  ],
  providers: [
    ParcelService
  ],
  template: `
    <div class="auxiliary-section">
      <app-fab-button-section/>
      @for (parcel of parcels; track parcel.config) {
        <app-auxiliary-parcel-element
          [parcelConfig]="parcel.config"
          class="auxiliary-section__element">
        </app-auxiliary-parcel-element>
      }
    </div>` ,
  styleUrl: "./auxiliary-section.scss"
})
export class AppAuxiliarySectionComponent extends OnDestroySubject implements OnInit, OnDestroy {

  parcels: ResolvedParcel[] = [];

  constructor(
    private readonly parcelService: ParcelService
  ) {
    super();
  }

  ngOnInit() {
    this.loadParcels();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  private loadParcels() {
    this.parcelService.parcels$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(async (parcels: AuxiliarySectionParcel[]) => {
        const auxiliaryParcels = parcels
          .filter(data => data.type === "parcel" && data.zone === "auxiliaryButtonsSection");

        const resolvedParcels = await Promise.all(
          auxiliaryParcels.map(async (parcel) => {
            const moduleApp = await System.import(parcel.importName);
            if (!moduleApp[parcel.name]) {
              return null;
            }

            return {
              order: parcel.order,
              config: moduleApp[parcel.name]
            };
          })
        );

        this.parcels = resolvedParcels
          .filter((item): item is ResolvedParcel => !!item)
          .sort((a, b) => b.order - a.order);
      });
  }
}

