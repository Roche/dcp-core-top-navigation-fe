import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {GxpState, gxpStore} from "@open-dcp/services";
import {Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {GxpDialogComponent, GxpDialogData} from "../gxp-dialog/gxp-dialog.component";
import {GxpIconComponent} from "../gxp-icon/gxp-icon.component";
import {MatTooltip} from "@angular/material/tooltip";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-gxp-label',
  standalone: true,
  templateUrl: './gxp-label.component.html',
  imports: [
    GxpIconComponent,
    MatTooltip,
    TranslateModule,
    NgClass
  ],
  styleUrls: ['./gxp-label.component.scss']
})
export class GxpLabelTopNavigationComponent implements OnInit, OnDestroy {
  isValidated: boolean = false;
  isDisabled: boolean = false;

  subscription = new Subscription();

  data: {[key: string]: (boolean | undefined)[]} = {

  };

  lastUrl = window.location.href;

  constructor(
    private readonly dialog: MatDialog
  ) {
    window.addEventListener('popstate', this.onPopstate);
  }

  ngOnInit(): void {
    this.subscription.add(
      gxpStore.subscribe(state => {
        this.updateDataState(state);
      })
    );

    this.subscription.add(
      gxpStore.subscribe('disableIndicator', disabled => {
        this.isDisabled = disabled;
      })
    );
  }

  ngOnDestroy() {
    window.removeEventListener('popstate', this.onPopstate);
    this.subscription.unsubscribe();
  }

  onPopstate = () => {
    const currentUrl = window.location.href;
    if (currentUrl === this.lastUrl) {
      return;
    }
    this.lastUrl = currentUrl;
    this.data = {};
    const appNames = gxpStore.getAppNames();
    appNames.forEach(appName => {
      if (!gxpStore.getState().activeApps[appName].enableAutoClearHistory) {
        return;
      }
      gxpStore.clearRequestHistory(appName);
    });
  }

  private updateDataState(state: GxpState) {
    setTimeout(() => {
      this.data = {};
      const appsNames = gxpStore.getAppNames();
      appsNames.forEach(appName => {
        this.fillGxpState(appName, state);
      });
      this.updateIsValidated();
    });
  }

  private updateIsValidated() {
    const appsValidated = Object.values(gxpStore.getState().activeApps).every(el => el.isValidated);
    if (!appsValidated) {
      this.isValidated = false;
      return;
    }
    const values = Object.values(this.data).flat();
    this.isValidated = values.every(el => el !== false);
  }

  private fillGxpState(appName: string, state: GxpState) {
    if (!state.activeApps[appName]) {
      return;
    }
    const requestHistory = state.activeApps[appName].requestHistory;
    let gxpState = [undefined, undefined, undefined, undefined];
    requestHistory.forEach((request, i) => {
      if (request.ignore) {
        return;
      }
      const scopeData = [request.backend, request.dataSource, request.calculationEngine, request.entity];

      gxpState = scopeData.map((data, index) => {
        if (data === undefined) {
          return gxpState[index];
        }
        return data;
      });
    });
    this.data[appName] = gxpState;
  }

  onIconClick() {
    if (this.isDisabled) {
      return;
    }
    this.dialog.open(GxpDialogComponent, {
      data: this.createDialogData(),
      maxWidth: '80vw',
      width: '500px'
    });
  }

  private createDialogData(): GxpDialogData[] {
    const data: GxpDialogData[] = [];

    const mainApps = gxpStore.getAppNames().filter(appName => appName.toLowerCase().includes('side menu') || appName.toLowerCase().includes('top navigation'));
    const otherApps = gxpStore.getAppNames().filter(appName => !appName.toLowerCase().includes('side menu') && !appName.toLowerCase().includes('top navigation'));
    const appNames = [...otherApps, ...mainApps];

    appNames.forEach(appName => {
      const [backend, dataSource, calculationEngine, entity] = this.data[appName] || [undefined, undefined, undefined, undefined];
      const el: GxpDialogData = {
        appName,
        isValidated: gxpStore.getState().activeApps[appName].isValidated,
        data: {
          backend, dataSource, calculationEngine, entity
        }
      }
      data.push(el);
    });
    return data;
  }
}
