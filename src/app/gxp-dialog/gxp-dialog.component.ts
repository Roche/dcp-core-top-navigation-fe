import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {NgForOf} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {MatButton} from "@angular/material/button";
import {
  MatAccordion,
  MatExpansionPanel, MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {GxpIconComponent} from "../gxp-icon/gxp-icon.component";

export interface GxpDialogData {
  appName: string,
  isValidated: boolean,
  data: {
    backend: boolean | undefined;
    dataSource: boolean | undefined;
    calculationEngine: boolean | undefined;
    entity: boolean | undefined;
  }
}

@Component({
  selector: 'app-gxp-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatTabGroup,
    MatDialogActions,
    MatTab,
    NgForOf,
    TranslateModule,
    MatButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    GxpIconComponent
  ],
  templateUrl: './gxp-dialog.component.html',
  styleUrl: './gxp-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GxpDialogComponent {
  cancelText = this.translate.instant('OK');
  validated = this.translate.instant('GXP_INFO.VALIDATED');
  notValidated = this.translate.instant('GXP_INFO.NOT_VALIDATED');
  constructor(
    private readonly translate: TranslateService,
    public readonly dialogRef: MatDialogRef<GxpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GxpDialogData[],
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  isValidated(tab: GxpDialogData) {
    if (
      !tab.isValidated
      || tab.data.backend === false
      || tab.data.dataSource === false
      || tab.data.calculationEngine === false
      || tab.data.entity === false
    ) {
      return false;
    }
    return true;
  }
}
