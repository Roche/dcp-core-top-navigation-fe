import { Injectable } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { delay, filter, map } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@angular/common";
/**
 * Track Route changes for applications using Angular's
 * default router
 *
 * @link https://angular.io/api/router/Router
 */
export class AngularRouterTracking {
    router;
    location;
    constructor(router, location) {
        this.router = router;
        this.location = location;
    }
    trackLocation(settings) {
        return this.router.events.pipe(filter(e => e instanceof NavigationEnd), filter(() => !settings.developerMode), map((e) => {
            return { url: e.urlAfterRedirects };
        }), delay(0));
    }
    prepareExternalUrl(url) {
        return this.location.prepareExternalUrl(url);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: AngularRouterTracking, deps: [{ token: i1.Router }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: AngularRouterTracking, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: AngularRouterTracking, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Router }, { type: i2.Location }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yb3V0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2FuZ3VsYXItcm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGFBQWEsRUFBVSxNQUFNLGlCQUFpQixDQUFDO0FBRXhELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBS3BEOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLHFCQUFxQjtJQUNaO0lBQXdCO0lBQTVDLFlBQW9CLE1BQWMsRUFBVSxRQUFrQjtRQUExQyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVTtJQUFHLENBQUM7SUFFbEUsYUFBYSxDQUFDLFFBQVE7UUFDcEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQzVCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxhQUFhLENBQUMsRUFDdkMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUNyQyxHQUFHLENBQUMsQ0FBQyxDQUFnQixFQUFFLEVBQUU7WUFDdkIsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN0QyxDQUFDLENBQUMsRUFDRixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQ1QsQ0FBQztJQUNKLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxHQUFXO1FBQzVCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQyxDQUFDO3dHQWhCVSxxQkFBcUI7NEdBQXJCLHFCQUFxQixjQURSLE1BQU07OzRGQUNuQixxQkFBcUI7a0JBRGpDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5hdmlnYXRpb25FbmQsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcblxyXG5pbXBvcnQgeyBkZWxheSwgZmlsdGVyLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IFJvdXRlcmxlc3NUcmFja2luZywgVHJhY2tOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnLi9yb3V0ZXJsZXNzJztcclxuXHJcbi8qKlxyXG4gKiBUcmFjayBSb3V0ZSBjaGFuZ2VzIGZvciBhcHBsaWNhdGlvbnMgdXNpbmcgQW5ndWxhcidzXHJcbiAqIGRlZmF1bHQgcm91dGVyXHJcbiAqXHJcbiAqIEBsaW5rIGh0dHBzOi8vYW5ndWxhci5pby9hcGkvcm91dGVyL1JvdXRlclxyXG4gKi9cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJSb3V0ZXJUcmFja2luZyBpbXBsZW1lbnRzIFJvdXRlcmxlc3NUcmFja2luZyB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByb3V0ZXI6IFJvdXRlciwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24pIHt9XHJcblxyXG4gIHRyYWNrTG9jYXRpb24oc2V0dGluZ3MpOiBPYnNlcnZhYmxlPFRyYWNrTmF2aWdhdGlvbkVuZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMucm91dGVyLmV2ZW50cy5waXBlKFxyXG4gICAgICBmaWx0ZXIoZSA9PiBlIGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCksXHJcbiAgICAgIGZpbHRlcigoKSA9PiAhc2V0dGluZ3MuZGV2ZWxvcGVyTW9kZSksXHJcbiAgICAgIG1hcCgoZTogTmF2aWdhdGlvbkVuZCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB7IHVybDogZS51cmxBZnRlclJlZGlyZWN0cyB9O1xyXG4gICAgICB9KSxcclxuICAgICAgZGVsYXkoMCksXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJlcGFyZUV4dGVybmFsVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLmxvY2F0aW9uLnByZXBhcmVFeHRlcm5hbFVybCh1cmwpO1xyXG4gIH1cclxufVxyXG4iXX0=