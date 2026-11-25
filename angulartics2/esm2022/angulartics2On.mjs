import { Directive, Input, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./angulartics2-core";
export class Angulartics2On {
    elRef;
    angulartics2;
    renderer;
    // eslint-disable-next-line @angular-eslint/no-input-rename
    angulartics2On;
    angularticsAction;
    angularticsCategory;
    angularticsLabel;
    angularticsValue;
    angularticsProperties = {};
    constructor(elRef, angulartics2, renderer) {
        this.elRef = elRef;
        this.angulartics2 = angulartics2;
        this.renderer = renderer;
    }
    ngAfterContentInit() {
        this.renderer.listen(this.elRef.nativeElement, this.angulartics2On || 'click', (event) => this.eventTrack(event));
    }
    eventTrack(event) {
        const action = this.angularticsAction; // || this.inferEventName();
        const properties = {
            ...this.angularticsProperties,
            eventType: event.type,
        };
        if (this.angularticsCategory) {
            properties.category = this.angularticsCategory;
        }
        if (this.angularticsLabel) {
            properties.label = this.angularticsLabel;
        }
        if (this.angularticsValue) {
            properties.value = this.angularticsValue;
        }
        this.angulartics2.eventTrack.next({
            action,
            properties,
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2On, deps: [{ token: i0.ElementRef }, { token: i1.Angulartics2 }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.2.12", type: Angulartics2On, selector: "[angulartics2On]", inputs: { angulartics2On: "angulartics2On", angularticsAction: "angularticsAction", angularticsCategory: "angularticsCategory", angularticsLabel: "angularticsLabel", angularticsValue: "angularticsValue", angularticsProperties: "angularticsProperties" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2On, decorators: [{
            type: Directive,
            args: [{ selector: '[angulartics2On]' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Angulartics2 }, { type: i0.Renderer2 }]; }, propDecorators: { angulartics2On: [{
                type: Input,
                args: ['angulartics2On']
            }], angularticsAction: [{
                type: Input
            }], angularticsCategory: [{
                type: Input
            }], angularticsLabel: [{
                type: Input
            }], angularticsValue: [{
                type: Input
            }], angularticsProperties: [{
                type: Input
            }] } });
export class Angulartics2OnModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2OnModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2OnModule, declarations: [Angulartics2On], exports: [Angulartics2On] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2OnModule });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2OnModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [Angulartics2On],
                    exports: [Angulartics2On],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcnRpY3MyT24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2FuZ3VsYXJ0aWNzMk9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBb0IsU0FBUyxFQUFjLEtBQUssRUFBRSxRQUFRLEVBQWEsTUFBTSxlQUFlLENBQUM7OztBQUlwRyxNQUFNLE9BQU8sY0FBYztJQVVmO0lBQ0E7SUFDQTtJQVhWLDJEQUEyRDtJQUNsQyxjQUFjLENBQVM7SUFDdkMsaUJBQWlCLENBQVM7SUFDMUIsbUJBQW1CLENBQVM7SUFDNUIsZ0JBQWdCLENBQVM7SUFDekIsZ0JBQWdCLENBQVM7SUFDekIscUJBQXFCLEdBQVEsRUFBRSxDQUFDO0lBRXpDLFlBQ1UsS0FBaUIsRUFDakIsWUFBMEIsRUFDMUIsUUFBbUI7UUFGbkIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQUNqQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixhQUFRLEdBQVIsUUFBUSxDQUFXO0lBQzFCLENBQUM7SUFFSixrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxLQUFZLEVBQUUsRUFBRSxDQUM5RixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUN2QixDQUFDO0lBQ0osQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFZO1FBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLDRCQUE0QjtRQUNuRSxNQUFNLFVBQVUsR0FBUTtZQUN0QixHQUFHLElBQUksQ0FBQyxxQkFBcUI7WUFDN0IsU0FBUyxFQUFFLEtBQUssQ0FBQyxJQUFJO1NBQ3RCLENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztTQUNoRDtRQUNELElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1NBQzFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsVUFBVSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7U0FDMUM7UUFFRCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDaEMsTUFBTTtZQUNOLFVBQVU7U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO3dHQTFDVSxjQUFjOzRGQUFkLGNBQWM7OzRGQUFkLGNBQWM7a0JBRDFCLFNBQVM7bUJBQUMsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUU7b0pBR2hCLGNBQWM7c0JBQXRDLEtBQUs7dUJBQUMsZ0JBQWdCO2dCQUNkLGlCQUFpQjtzQkFBekIsS0FBSztnQkFDRyxtQkFBbUI7c0JBQTNCLEtBQUs7Z0JBQ0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxxQkFBcUI7c0JBQTdCLEtBQUs7O0FBb0RSLE1BQU0sT0FBTyxvQkFBb0I7d0dBQXBCLG9CQUFvQjt5R0FBcEIsb0JBQW9CLGlCQTNEcEIsY0FBYyxhQUFkLGNBQWM7eUdBMkRkLG9CQUFvQjs7NEZBQXBCLG9CQUFvQjtrQkFKaEMsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUM7b0JBQzlCLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBOZ01vZHVsZSwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFuZ3VsYXJ0aWNzMiB9IGZyb20gJy4vYW5ndWxhcnRpY3MyLWNvcmUnO1xyXG5cclxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW2FuZ3VsYXJ0aWNzMk9uXScgfSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJ0aWNzMk9uIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCB7XHJcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEBhbmd1bGFyLWVzbGludC9uby1pbnB1dC1yZW5hbWVcclxuICBASW5wdXQoJ2FuZ3VsYXJ0aWNzMk9uJykgYW5ndWxhcnRpY3MyT246IHN0cmluZztcclxuICBASW5wdXQoKSBhbmd1bGFydGljc0FjdGlvbjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGFuZ3VsYXJ0aWNzQ2F0ZWdvcnk6IHN0cmluZztcclxuICBASW5wdXQoKSBhbmd1bGFydGljc0xhYmVsOiBzdHJpbmc7XHJcbiAgQElucHV0KCkgYW5ndWxhcnRpY3NWYWx1ZTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGFuZ3VsYXJ0aWNzUHJvcGVydGllczogYW55ID0ge307XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBlbFJlZjogRWxlbWVudFJlZixcclxuICAgIHByaXZhdGUgYW5ndWxhcnRpY3MyOiBBbmd1bGFydGljczIsXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXHJcbiAgKSB7fVxyXG5cclxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XHJcbiAgICB0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmVsUmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuYW5ndWxhcnRpY3MyT24gfHwgJ2NsaWNrJywgKGV2ZW50OiBFdmVudCkgPT5cclxuICAgICAgdGhpcy5ldmVudFRyYWNrKGV2ZW50KSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBldmVudFRyYWNrKGV2ZW50OiBFdmVudCkge1xyXG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5hbmd1bGFydGljc0FjdGlvbjsgLy8gfHwgdGhpcy5pbmZlckV2ZW50TmFtZSgpO1xyXG4gICAgY29uc3QgcHJvcGVydGllczogYW55ID0ge1xyXG4gICAgICAuLi50aGlzLmFuZ3VsYXJ0aWNzUHJvcGVydGllcyxcclxuICAgICAgZXZlbnRUeXBlOiBldmVudC50eXBlLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAodGhpcy5hbmd1bGFydGljc0NhdGVnb3J5KSB7XHJcbiAgICAgIHByb3BlcnRpZXMuY2F0ZWdvcnkgPSB0aGlzLmFuZ3VsYXJ0aWNzQ2F0ZWdvcnk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5hbmd1bGFydGljc0xhYmVsKSB7XHJcbiAgICAgIHByb3BlcnRpZXMubGFiZWwgPSB0aGlzLmFuZ3VsYXJ0aWNzTGFiZWw7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5hbmd1bGFydGljc1ZhbHVlKSB7XHJcbiAgICAgIHByb3BlcnRpZXMudmFsdWUgPSB0aGlzLmFuZ3VsYXJ0aWNzVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hbmd1bGFydGljczIuZXZlbnRUcmFjay5uZXh0KHtcclxuICAgICAgYWN0aW9uLFxyXG4gICAgICBwcm9wZXJ0aWVzLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKnByaXZhdGUgaXNDb21tYW5kKCkge1xyXG4gICAgcmV0dXJuIFsnYTonLCAnYnV0dG9uOicsICdidXR0b246YnV0dG9uJywgJ2J1dHRvbjpzdWJtaXQnLCAnaW5wdXQ6YnV0dG9uJywgJ2lucHV0OnN1Ym1pdCddLmluZGV4T2YoXHJcbiAgICAgIGdldERPTSgpLnRhZ05hbWUodGhpcy5lbCkudG9Mb3dlckNhc2UoKSArICc6JyArIChnZXRET00oKS50eXBlKHRoaXMuZWwpIHx8ICcnKSkgPj0gMDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5mZXJFdmVudE5hbWUoKSB7XHJcbiAgICBpZiAodGhpcy5pc0NvbW1hbmQoKSkgcmV0dXJuIGdldERPTSgpLmdldFRleHQodGhpcy5lbCkgfHwgZ2V0RE9NKCkuZ2V0VmFsdWUodGhpcy5lbCk7XHJcbiAgICByZXR1cm4gZ2V0RE9NKCkuZ2V0UHJvcGVydHkodGhpcy5lbCwgJ2lkJykgfHwgZ2V0RE9NKCkuZ2V0UHJvcGVydHkodGhpcy5lbCwgJ25hbWUnKSB8fCBnZXRET00oKS50YWdOYW1lKHRoaXMuZWwpO1xyXG4gIH0qL1xyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGRlY2xhcmF0aW9uczogW0FuZ3VsYXJ0aWNzMk9uXSxcclxuICBleHBvcnRzOiBbQW5ndWxhcnRpY3MyT25dLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhcnRpY3MyT25Nb2R1bGUge31cclxuIl19