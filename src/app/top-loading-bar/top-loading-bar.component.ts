import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {uiStore} from "@open-dcp/services";
import {BehaviorSubject, Subscription} from "rxjs";

@Component({
  selector: 'app-top-loading-bar',
  templateUrl: './top-loading-bar.component.html',
  styleUrls: ['./top-loading-bar.component.scss']
})
export class TopLoadingBarComponent implements OnInit, OnDestroy {

  loading = new BehaviorSubject<boolean>(false);

  subscription = new Subscription();
  private loadingTimeout: number;

  constructor(
    private readonly ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.subscribeToLoading();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearTimeout(this.loadingTimeout);
  }

  private subscribeToLoading() {
    this.subscription.add(
      uiStore.subscribe('loading', loading => {
        const result = Object.keys(loading).length > 0;
        this.ngZone.run(() => {
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
          }
          if (result) {
            this.loading.next(result);
          } else {
            // @ts-ignore
            this.loadingTimeout = setTimeout(() => {
              this.loading.next(result);
            }, 200)
          }
        });
      })
    );
  }
}
