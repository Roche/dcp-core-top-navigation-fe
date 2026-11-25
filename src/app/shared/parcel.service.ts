import {Injectable, OnInit} from '@angular/core';
import {DcHttp} from "@open-dcp/angular-services";
import {BehaviorSubject, lastValueFrom} from "rxjs";
import {uiStore} from "@open-dcp/services";

/**
 * @class ParcelService
 * @description
 * A singleton service responsible for fetching, processing, and providing
 * micro-frontend "parcel" metadata from a remote registry.
 * * It manages the loading state via a global `uiStore` and exposes a stream
 * of sorted parcel data that other components (like FAB sections or headers)
 * can subscribe to for dynamic UI rendering.
 */
@Injectable({
  providedIn: 'root'
})
export class ParcelService {

  private readonly parcels = new BehaviorSubject([]);

  parcels$ = this.parcels.asObservable();

  constructor(
    private readonly http: DcHttp
  ) {
    this.getAppData();
  }

  private getAppData() {
    uiStore.setLoading('appDataModules');
    lastValueFrom(
      this.http.get(`${this.http.gatewayModuleUrl('registry')}/microfrontends/parcel-data/list`)
    )
      .then((res: any) => {
        this.loadParcels(res);
      })
      .finally(() => {
        uiStore.removeLoading('appDataModules');
      });
  }

  private loadParcels(res: any) {
    const flatAppData = Array.isArray(res)
      ? (res as any[]).flat?.() ?? ([] as any[]).concat(...res)
      : [];
    const sortedAppData = flatAppData.sort((a, b) =>  b.order - a.order);
    this.parcels.next(sortedAppData);
  }
}
