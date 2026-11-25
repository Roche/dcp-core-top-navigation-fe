import {Component, Input, OnInit, ViewChild, ElementRef, ViewEncapsulation, Output, EventEmitter} from "@angular/core";
import {ParcelComponent} from "single-spa-angular/parcel";
import {mountRootParcel, ParcelConfig} from "single-spa";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: "app-fab-parcel-element",
  standalone: true,
  imports: [
    ParcelComponent,
    NgIf,
    NgClass
  ],
  template: `
    <span #parcelContainer class="fab-button_element" [ngClass]="{'fab-button_element--active': triggerActive}" *ngIf="parcelConfig">
      <parcel
        [config]="parcelConfig"
        [customProps]="parcelProps"
        [appendTo]="parcelContainer"
        [onParcelMount]="onParcelMount"
        [mountParcel]="mountParcel">
      </parcel>
    </span>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class AppFabParcelElementComponent implements OnInit {
  @Input() parcelConfig: ParcelConfig;
  @Input() triggerActive = false;
  @Output() visibilityChange = new EventEmitter<boolean>();

  @ViewChild('parcelContainer', {read: ElementRef})
  parcelContainer: ElementRef<HTMLElement>;

  protected readonly mountParcel = mountRootParcel;

  parcelProps: any = {};

  private parcelMounted = false;

  readonly onParcelMount = () => {
    const wrapperElement = this.getMountedParcelDomElement();
    if (wrapperElement) {
      this.parcelProps = {
        ...this.parcelProps,
        domElement: wrapperElement,
        onVisibilityChange: (visible: boolean) => this.visibilityChange.emit(visible)
      };
    }
    this.parcelMounted = true;
  };

  ngOnInit() {
    this.parcelProps = {
      domElement: null,
      onVisibilityChange: (visible: boolean) => this.visibilityChange.emit(visible)
    };
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

