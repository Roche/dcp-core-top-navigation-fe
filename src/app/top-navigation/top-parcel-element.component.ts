import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {Parcel, ParcelConfig, mountRootParcel} from "single-spa";
import {NgIf} from "@angular/common";

@Component({
  selector: "app-top-parcel-element",
  standalone: true,
  imports: [
    NgIf
  ],
  template: `
    <span class="top-parcel-element" *ngIf="parcelConfig">
      <div #parcelMountPoint class="top-parcel-element__mount"></div>
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    .top-parcel-element {
      display: inline-block;
    }
    .top-parcel-element__mount {
      display: inline-block;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class AppTopParcelElementComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() parcelConfig: ParcelConfig;
  @Input() instanceId: string;

  @ViewChild("parcelMountPoint", {read: ElementRef})
  parcelMountPoint: ElementRef<HTMLElement>;

  private parcelInstance: Parcel | null = null;

  private viewReady = false;

  ngAfterViewInit() {
    this.viewReady = true;
    this.mountParcel();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.viewReady) {
      return;
    }

    if (changes?.parcelConfig?.currentValue || changes?.instanceId?.currentValue) {
      void this.remountParcel();
    }
  }

  ngOnDestroy() {
    void this.unmountParcel();
  }

  private mountParcel() {
    const domElement = this.parcelMountPoint?.nativeElement;
    if (!this.parcelConfig || !domElement) {
      return;
    }

    const config: ParcelConfig = this.parcelConfig;
    this.parcelInstance = mountRootParcel(
      config,
      {
        domElement,
        instanceId: this.instanceId
      }
    );

    this.parcelInstance.mountPromise?.catch((err) => {
      console.error("Failed to mount top parcel instance", this.instanceId, err);
    });
  }

  private async remountParcel() {
    await this.unmountParcel();
    this.mountParcel();
  }

  private async unmountParcel() {
    const mountElement = this.parcelMountPoint?.nativeElement;

    if (!this.parcelInstance) {
      if (mountElement) {
        mountElement.innerHTML = "";
      }
      return;
    }

    try {
      await this.parcelInstance.unmount();
    } finally {
      this.parcelInstance = null;
      if (mountElement) {
        mountElement.innerHTML = "";
      }
    }
  }
}
