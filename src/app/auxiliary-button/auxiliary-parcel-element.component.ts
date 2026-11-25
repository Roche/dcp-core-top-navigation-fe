import {Component, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation} from "@angular/core";
import {ParcelComponent} from "single-spa-angular/parcel";
import {mountRootParcel, ParcelConfig} from "single-spa";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-auxiliary-parcel-element",
  standalone: true,
  imports: [
    ParcelComponent,
    NgIf
  ],
  template: `
    <div #parcelContainer class="auxiliary-parcel-element" *ngIf="parcelConfig">
      <parcel
        [config]="parcelConfig"
        [customProps]="parcelProps"
        [appendTo]="parcelContainer"
        [onParcelMount]="onParcelMount"
        [mountParcel]="mountParcel">
      </parcel>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .auxiliary-parcel-element {
      display: block;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class AppAuxiliaryParcelElementComponent implements OnInit {
  @Input() parcelConfig: ParcelConfig;

  @ViewChild('parcelContainer', {read: ElementRef})
  parcelContainer: ElementRef<HTMLElement>;

  protected readonly mountParcel = mountRootParcel;

  parcelProps: any = {};

  private parcelMounted = false;

  readonly onParcelMount = () => {
    const wrapperElement = this.getMountedParcelDomElement();
    if (wrapperElement) {
      this.parcelProps = {...this.parcelProps, domElement: wrapperElement};
    }
    this.parcelMounted = true;
  };

  ngOnInit() {
    this.parcelProps = {domElement: null};
  }

  private getMountedParcelDomElement(): Element | null {
    const container = this.parcelContainer?.nativeElement;
    if (!container) {
      return null;
    }

    // Find the wrapper div created by single-spa, excluding the <parcel> tag itself
    const wrapper = Array.from(container.children).find(
      (child) => child.tagName.toLowerCase() !== 'parcel'
    );
    return wrapper ?? null;
  }
}

