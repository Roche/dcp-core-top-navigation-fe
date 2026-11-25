import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-gxp-icon',
  standalone: true,
  templateUrl: './gxp-icon.component.html',
  imports: [
    NgClass,
    TranslateModule,
    NgIf
  ],
  styleUrls: ['./gxp-icon.component.scss']
})
export class GxpIconComponent {
  @Input() isValidated = false;

  @Input() isDisabled = false;

  @Input() size: 'small' | 'normal' = 'normal';
}
