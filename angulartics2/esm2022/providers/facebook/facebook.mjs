import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
const facebookEventList = [
    'ViewContent',
    'Search',
    'AddToCart',
    'AddToWishlist',
    'InitiateCheckout',
    'AddPaymentInfo',
    'Purchase',
    'Lead',
    'CompleteRegistration',
];
export class Angulartics2Facebook {
    angulartics2;
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
    }
    startTracking() {
        this.angulartics2.eventTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.eventTrack(x.action, x.properties));
    }
    /**
     * Send interactions to the Pixel, i.e. for event tracking in Pixel
     *
     * @param action action associated with the event
     */
    eventTrack(action, properties = {}) {
        if (typeof fbq === 'undefined') {
            return;
        }
        if (facebookEventList.indexOf(action) === -1) {
            return fbq('trackCustom', action, properties);
        }
        return fbq('track', action, properties);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Facebook, deps: [{ token: i1.Angulartics2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Facebook, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Facebook, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZWJvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Byb3ZpZGVycy9mYWNlYm9vay9mYWNlYm9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFNM0MsTUFBTSxpQkFBaUIsR0FBRztJQUN4QixhQUFhO0lBQ2IsUUFBUTtJQUNSLFdBQVc7SUFDWCxlQUFlO0lBQ2Ysa0JBQWtCO0lBQ2xCLGdCQUFnQjtJQUNoQixVQUFVO0lBQ1YsTUFBTTtJQUNOLHNCQUFzQjtDQUN2QixDQUFDO0FBR0YsTUFBTSxPQUFPLG9CQUFvQjtJQUNYO0lBQXBCLFlBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO0lBQUksQ0FBQztJQUVuRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVO2FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDN0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsVUFBVSxDQUFDLE1BQWMsRUFBRSxhQUFrQixFQUFFO1FBQzdDLElBQUksT0FBTyxHQUFHLEtBQUssV0FBVyxFQUFFO1lBQzlCLE9BQU87U0FDUjtRQUNELElBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzVDLE9BQU8sR0FBRyxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDL0M7UUFDRCxPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7d0dBdEJVLG9CQUFvQjs0R0FBcEIsb0JBQW9CLGNBRFAsTUFBTTs7NEZBQ25CLG9CQUFvQjtrQkFEaEMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBBbmd1bGFydGljczIgfSBmcm9tICcuLi8uLi9hbmd1bGFydGljczItY29yZSc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IGZicTogZmFjZWJvb2suUGl4ZWwuRXZlbnQ7XHJcblxyXG5jb25zdCBmYWNlYm9va0V2ZW50TGlzdCA9IFtcclxuICAnVmlld0NvbnRlbnQnLFxyXG4gICdTZWFyY2gnLFxyXG4gICdBZGRUb0NhcnQnLFxyXG4gICdBZGRUb1dpc2hsaXN0JyxcclxuICAnSW5pdGlhdGVDaGVja291dCcsXHJcbiAgJ0FkZFBheW1lbnRJbmZvJyxcclxuICAnUHVyY2hhc2UnLFxyXG4gICdMZWFkJyxcclxuICAnQ29tcGxldGVSZWdpc3RyYXRpb24nLFxyXG5dO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJ0aWNzMkZhY2Vib29rIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFuZ3VsYXJ0aWNzMjogQW5ndWxhcnRpY3MyKSB7IH1cclxuXHJcbiAgc3RhcnRUcmFja2luZygpOiB2b2lkIHtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLmV2ZW50VHJhY2tcclxuICAgICAgLnBpcGUodGhpcy5hbmd1bGFydGljczIuZmlsdGVyRGV2ZWxvcGVyTW9kZSgpKVxyXG4gICAgICAuc3Vic2NyaWJlKHggPT4gdGhpcy5ldmVudFRyYWNrKHguYWN0aW9uLCB4LnByb3BlcnRpZXMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgaW50ZXJhY3Rpb25zIHRvIHRoZSBQaXhlbCwgaS5lLiBmb3IgZXZlbnQgdHJhY2tpbmcgaW4gUGl4ZWxcclxuICAgKlxyXG4gICAqIEBwYXJhbSBhY3Rpb24gYWN0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgZXZlbnRcclxuICAgKi9cclxuICBldmVudFRyYWNrKGFjdGlvbjogc3RyaW5nLCBwcm9wZXJ0aWVzOiBhbnkgPSB7fSkge1xyXG4gICAgaWYgKHR5cGVvZiBmYnEgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChmYWNlYm9va0V2ZW50TGlzdC5pbmRleE9mKGFjdGlvbikgPT09IC0xKSB7XHJcbiAgICAgIHJldHVybiBmYnEoJ3RyYWNrQ3VzdG9tJywgYWN0aW9uLCBwcm9wZXJ0aWVzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYnEoJ3RyYWNrJywgYWN0aW9uLCBwcm9wZXJ0aWVzKTtcclxuICB9XHJcbn1cclxuIl19