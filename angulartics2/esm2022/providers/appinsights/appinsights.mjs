import { Injectable } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/router";
export class AppInsightsDefaults {
    userId = null;
}
export class Angulartics2AppInsights {
    angulartics2;
    title;
    router;
    loadStartTime = null;
    loadTime = null;
    metrics = null;
    dimensions = null;
    measurements = null;
    constructor(angulartics2, title, router) {
        this.angulartics2 = angulartics2;
        this.title = title;
        this.router = router;
        if (typeof appInsights === 'undefined') {
            console.warn('appInsights not found');
        }
        const defaults = new AppInsightsDefaults();
        // Set the default settings for this module
        this.angulartics2.settings.appInsights = {
            ...defaults,
            ...this.angulartics2.settings.appInsights,
        };
        this.angulartics2.setUsername.subscribe((x) => this.setUsername(x));
        this.angulartics2.setUserProperties.subscribe((x) => this.setUserProperties(x));
    }
    startTracking() {
        this.angulartics2.pageTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.pageTrack(x.path));
        this.angulartics2.eventTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.eventTrack(x.action, x.properties));
        this.angulartics2.exceptionTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.exceptionTrack(x));
        this.router.events
            .pipe(this.angulartics2.filterDeveloperMode(), filter((event) => event instanceof NavigationStart))
            .subscribe((event) => this.startTimer());
        this.router.events
            .pipe(filter((event) => event instanceof NavigationError || event instanceof NavigationEnd))
            .subscribe((error) => this.stopTimer());
    }
    startTimer() {
        this.loadStartTime = Date.now();
        this.loadTime = null;
    }
    stopTimer() {
        this.loadTime = Date.now() - this.loadStartTime;
        this.loadStartTime = null;
    }
    /**
     * Page Track in Baidu Analytics
     *
     * @param path - Location 'path'
     *
     * @link https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#trackpageview
     */
    pageTrack(path) {
        appInsights.trackPageView(this.title.getTitle(), path, this.dimensions, this.metrics, this.loadTime);
    }
    /**
     * Log a user action or other occurrence.
     *
     * @param name Name to identify this event in the portal.
     * @param properties Additional data used to filter events and metrics in the portal. Defaults to empty.
     *
     * @link https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#trackevent
     */
    eventTrack(name, properties) {
        appInsights.trackEvent(name, properties, this.measurements);
    }
    /**
     * Exception Track Event in GA
     *
     * @param properties - Comprised of the mandatory fields 'appId' (string), 'appName' (string) and 'appVersion' (string) and
     * optional fields 'fatal' (boolean) and 'description' (string), error
     *
     * @link https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#trackexception
     */
    exceptionTrack(properties) {
        const description = properties.event || properties.description || properties;
        appInsights.trackException(description);
    }
    /**
     * @link https://github.com/Microsoft/ApplicationInsights-JS/blob/master/API-reference.md#setauthenticatedusercontext
     */
    setUsername(userId) {
        this.angulartics2.settings.appInsights.userId = userId;
        appInsights.setAuthenticatedUserContext(userId);
    }
    setUserProperties(properties) {
        if (properties.userId) {
            this.angulartics2.settings.appInsights.userId = properties.userId;
        }
        if (properties.accountId) {
            appInsights.setAuthenticatedUserContext(this.angulartics2.settings.appInsights.userId, properties.accountId);
        }
        else {
            appInsights.setAuthenticatedUserContext(this.angulartics2.settings.appInsights.userId);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2AppInsights, deps: [{ token: i1.Angulartics2 }, { token: i2.Title }, { token: i3.Router }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2AppInsights, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2AppInsights, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }, { type: i2.Title }, { type: i3.Router }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwaW5zaWdodHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Byb3ZpZGVycy9hcHBpbnNpZ2h0cy9hcHBpbnNpZ2h0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFDTCxhQUFhLEVBQ2IsZUFBZSxFQUNmLGVBQWUsR0FFaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0FBT3hDLE1BQU0sT0FBTyxtQkFBbUI7SUFDOUIsTUFBTSxHQUFHLElBQUksQ0FBQztDQUNmO0FBR0QsTUFBTSxPQUFPLHVCQUF1QjtJQVN4QjtJQUNBO0lBQ0E7SUFWVixhQUFhLEdBQVcsSUFBSSxDQUFDO0lBQzdCLFFBQVEsR0FBVyxJQUFJLENBQUM7SUFFeEIsT0FBTyxHQUErQixJQUFJLENBQUM7SUFDM0MsVUFBVSxHQUErQixJQUFJLENBQUM7SUFDOUMsWUFBWSxHQUErQixJQUFJLENBQUM7SUFFaEQsWUFDVSxZQUEwQixFQUMxQixLQUFZLEVBQ1osTUFBYztRQUZkLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLFVBQUssR0FBTCxLQUFLLENBQU87UUFDWixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRXRCLElBQUksT0FBTyxXQUFXLEtBQUssV0FBVyxFQUFFO1lBQ3RDLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQztTQUN2QztRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztRQUMzQywyQ0FBMkM7UUFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHO1lBQ3ZDLEdBQUcsUUFBUTtZQUNYLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVztTQUMxQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUNsRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQzFCLENBQUM7SUFDSixDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUzthQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQzdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVU7YUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWM7YUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07YUFDZixJQUFJLENBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxFQUN2QyxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssWUFBWSxlQUFlLENBQUMsQ0FDcEQ7YUFDQSxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTthQUNmLElBQUksQ0FDSCxNQUFNLENBQ0osQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUNSLEtBQUssWUFBWSxlQUFlLElBQUksS0FBSyxZQUFZLGFBQWEsQ0FDckUsQ0FDRjthQUNBLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDaEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFNBQVMsQ0FBQyxJQUFZO1FBQ3BCLFdBQVcsQ0FBQyxhQUFhLENBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEVBQ3JCLElBQUksRUFDSixJQUFJLENBQUMsVUFBVSxFQUNmLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFFBQVEsQ0FDZCxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxVQUFVLENBQUMsSUFBWSxFQUFFLFVBQXNDO1FBQzdELFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxjQUFjLENBQUMsVUFBZTtRQUM1QixNQUFNLFdBQVcsR0FDZixVQUFVLENBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxXQUFXLElBQUksVUFBVSxDQUFDO1FBRTNELFdBQVcsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVyxDQUFDLE1BQWM7UUFDeEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdkQsV0FBVyxDQUFDLDJCQUEyQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxpQkFBaUIsQ0FDZixVQUEwRDtRQUUxRCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1NBQ25FO1FBQ0QsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFO1lBQ3hCLFdBQVcsQ0FBQywyQkFBMkIsQ0FDckMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFDN0MsVUFBVSxDQUFDLFNBQVMsQ0FDckIsQ0FBQztTQUNIO2FBQU07WUFDTCxXQUFXLENBQUMsMkJBQTJCLENBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQzlDLENBQUM7U0FDSDtJQUNILENBQUM7d0dBdElVLHVCQUF1Qjs0R0FBdkIsdUJBQXVCLGNBRFYsTUFBTTs7NEZBQ25CLHVCQUF1QjtrQkFEbkMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFRpdGxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7XHJcbiAgTmF2aWdhdGlvbkVuZCxcclxuICBOYXZpZ2F0aW9uRXJyb3IsXHJcbiAgTmF2aWdhdGlvblN0YXJ0LFxyXG4gIFJvdXRlcixcclxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5pbXBvcnQgeyBBcHBJbnNpZ2h0c1NldHRpbmdzIH0gZnJvbSAnLi4vLi4vYW5ndWxhcnRpY3MyLWNvbmZpZyc7XHJcbmltcG9ydCB7IEFuZ3VsYXJ0aWNzMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXJ0aWNzMi1jb3JlJztcclxuXHJcbmRlY2xhcmUgY29uc3QgYXBwSW5zaWdodHM6IE1pY3Jvc29mdC5BcHBsaWNhdGlvbkluc2lnaHRzLklBcHBJbnNpZ2h0cztcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBJbnNpZ2h0c0RlZmF1bHRzIGltcGxlbWVudHMgQXBwSW5zaWdodHNTZXR0aW5ncyB7XHJcbiAgdXNlcklkID0gbnVsbDtcclxufVxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJ0aWNzMkFwcEluc2lnaHRzIHtcclxuICBsb2FkU3RhcnRUaW1lOiBudW1iZXIgPSBudWxsO1xyXG4gIGxvYWRUaW1lOiBudW1iZXIgPSBudWxsO1xyXG5cclxuICBtZXRyaWNzOiB7IFtuYW1lOiBzdHJpbmddOiBudW1iZXIgfSA9IG51bGw7XHJcbiAgZGltZW5zaW9uczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0gPSBudWxsO1xyXG4gIG1lYXN1cmVtZW50czogeyBbbmFtZTogc3RyaW5nXTogbnVtYmVyIH0gPSBudWxsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgYW5ndWxhcnRpY3MyOiBBbmd1bGFydGljczIsXHJcbiAgICBwcml2YXRlIHRpdGxlOiBUaXRsZSxcclxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcclxuICApIHtcclxuICAgIGlmICh0eXBlb2YgYXBwSW5zaWdodHMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignYXBwSW5zaWdodHMgbm90IGZvdW5kJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVmYXVsdHMgPSBuZXcgQXBwSW5zaWdodHNEZWZhdWx0cygpO1xyXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHNldHRpbmdzIGZvciB0aGlzIG1vZHVsZVxyXG4gICAgdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuYXBwSW5zaWdodHMgPSB7XHJcbiAgICAgIC4uLmRlZmF1bHRzLFxyXG4gICAgICAuLi50aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5hcHBJbnNpZ2h0cyxcclxuICAgIH07XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXRVc2VybmFtZS5zdWJzY3JpYmUoKHg6IHN0cmluZykgPT4gdGhpcy5zZXRVc2VybmFtZSh4KSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXRVc2VyUHJvcGVydGllcy5zdWJzY3JpYmUoKHgpID0+XHJcbiAgICAgIHRoaXMuc2V0VXNlclByb3BlcnRpZXMoeClcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzdGFydFRyYWNraW5nKCk6IHZvaWQge1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIucGFnZVRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSgoeCkgPT4gdGhpcy5wYWdlVHJhY2soeC5wYXRoKSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5ldmVudFRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSgoeCkgPT4gdGhpcy5ldmVudFRyYWNrKHguYWN0aW9uLCB4LnByb3BlcnRpZXMpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLmV4Y2VwdGlvblRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSgoeCkgPT4gdGhpcy5leGNlcHRpb25UcmFjayh4KSk7XHJcbiAgICB0aGlzLnJvdXRlci5ldmVudHNcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgdGhpcy5hbmd1bGFydGljczIuZmlsdGVyRGV2ZWxvcGVyTW9kZSgpLFxyXG4gICAgICAgIGZpbHRlcigoZXZlbnQpID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KVxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50KSA9PiB0aGlzLnN0YXJ0VGltZXIoKSk7XHJcblxyXG4gICAgdGhpcy5yb3V0ZXIuZXZlbnRzXHJcbiAgICAgIC5waXBlKFxyXG4gICAgICAgIGZpbHRlcihcclxuICAgICAgICAgIChldmVudCkgPT5cclxuICAgICAgICAgICAgZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRXJyb3IgfHwgZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kXHJcbiAgICAgICAgKVxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKGVycm9yKSA9PiB0aGlzLnN0b3BUaW1lcigpKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0VGltZXIoKSB7XHJcbiAgICB0aGlzLmxvYWRTdGFydFRpbWUgPSBEYXRlLm5vdygpO1xyXG4gICAgdGhpcy5sb2FkVGltZSA9IG51bGw7XHJcbiAgfVxyXG5cclxuICBzdG9wVGltZXIoKSB7XHJcbiAgICB0aGlzLmxvYWRUaW1lID0gRGF0ZS5ub3coKSAtIHRoaXMubG9hZFN0YXJ0VGltZTtcclxuICAgIHRoaXMubG9hZFN0YXJ0VGltZSA9IG51bGw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBQYWdlIFRyYWNrIGluIEJhaWR1IEFuYWx5dGljc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIHBhdGggLSBMb2NhdGlvbiAncGF0aCdcclxuICAgKlxyXG4gICAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvQXBwbGljYXRpb25JbnNpZ2h0cy1KUy9ibG9iL21hc3Rlci9BUEktcmVmZXJlbmNlLm1kI3RyYWNrcGFnZXZpZXdcclxuICAgKi9cclxuICBwYWdlVHJhY2socGF0aDogc3RyaW5nKSB7XHJcbiAgICBhcHBJbnNpZ2h0cy50cmFja1BhZ2VWaWV3KFxyXG4gICAgICB0aGlzLnRpdGxlLmdldFRpdGxlKCksXHJcbiAgICAgIHBhdGgsXHJcbiAgICAgIHRoaXMuZGltZW5zaW9ucyxcclxuICAgICAgdGhpcy5tZXRyaWNzLFxyXG4gICAgICB0aGlzLmxvYWRUaW1lXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9nIGEgdXNlciBhY3Rpb24gb3Igb3RoZXIgb2NjdXJyZW5jZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBuYW1lIE5hbWUgdG8gaWRlbnRpZnkgdGhpcyBldmVudCBpbiB0aGUgcG9ydGFsLlxyXG4gICAqIEBwYXJhbSBwcm9wZXJ0aWVzIEFkZGl0aW9uYWwgZGF0YSB1c2VkIHRvIGZpbHRlciBldmVudHMgYW5kIG1ldHJpY3MgaW4gdGhlIHBvcnRhbC4gRGVmYXVsdHMgdG8gZW1wdHkuXHJcbiAgICpcclxuICAgKiBAbGluayBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L0FwcGxpY2F0aW9uSW5zaWdodHMtSlMvYmxvYi9tYXN0ZXIvQVBJLXJlZmVyZW5jZS5tZCN0cmFja2V2ZW50XHJcbiAgICovXHJcbiAgZXZlbnRUcmFjayhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM6IHsgW25hbWU6IHN0cmluZ106IHN0cmluZyB9KSB7XHJcbiAgICBhcHBJbnNpZ2h0cy50cmFja0V2ZW50KG5hbWUsIHByb3BlcnRpZXMsIHRoaXMubWVhc3VyZW1lbnRzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4Y2VwdGlvbiBUcmFjayBFdmVudCBpbiBHQVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHByb3BlcnRpZXMgLSBDb21wcmlzZWQgb2YgdGhlIG1hbmRhdG9yeSBmaWVsZHMgJ2FwcElkJyAoc3RyaW5nKSwgJ2FwcE5hbWUnIChzdHJpbmcpIGFuZCAnYXBwVmVyc2lvbicgKHN0cmluZykgYW5kXHJcbiAgICogb3B0aW9uYWwgZmllbGRzICdmYXRhbCcgKGJvb2xlYW4pIGFuZCAnZGVzY3JpcHRpb24nIChzdHJpbmcpLCBlcnJvclxyXG4gICAqXHJcbiAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9BcHBsaWNhdGlvbkluc2lnaHRzLUpTL2Jsb2IvbWFzdGVyL0FQSS1yZWZlcmVuY2UubWQjdHJhY2tleGNlcHRpb25cclxuICAgKi9cclxuICBleGNlcHRpb25UcmFjayhwcm9wZXJ0aWVzOiBhbnkpIHtcclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uID1cclxuICAgICAgcHJvcGVydGllcy5ldmVudCB8fCBwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uIHx8IHByb3BlcnRpZXM7XHJcblxyXG4gICAgYXBwSW5zaWdodHMudHJhY2tFeGNlcHRpb24oZGVzY3JpcHRpb24pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9BcHBsaWNhdGlvbkluc2lnaHRzLUpTL2Jsb2IvbWFzdGVyL0FQSS1yZWZlcmVuY2UubWQjc2V0YXV0aGVudGljYXRlZHVzZXJjb250ZXh0XHJcbiAgICovXHJcbiAgc2V0VXNlcm5hbWUodXNlcklkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmFwcEluc2lnaHRzLnVzZXJJZCA9IHVzZXJJZDtcclxuICAgIGFwcEluc2lnaHRzLnNldEF1dGhlbnRpY2F0ZWRVc2VyQ29udGV4dCh1c2VySWQpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlclByb3BlcnRpZXMoXHJcbiAgICBwcm9wZXJ0aWVzOiBQYXJ0aWFsPHsgdXNlcklkOiBzdHJpbmc7IGFjY291bnRJZDogc3RyaW5nIH0+XHJcbiAgKSB7XHJcbiAgICBpZiAocHJvcGVydGllcy51c2VySWQpIHtcclxuICAgICAgdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuYXBwSW5zaWdodHMudXNlcklkID0gcHJvcGVydGllcy51c2VySWQ7XHJcbiAgICB9XHJcbiAgICBpZiAocHJvcGVydGllcy5hY2NvdW50SWQpIHtcclxuICAgICAgYXBwSW5zaWdodHMuc2V0QXV0aGVudGljYXRlZFVzZXJDb250ZXh0KFxyXG4gICAgICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmFwcEluc2lnaHRzLnVzZXJJZCxcclxuICAgICAgICBwcm9wZXJ0aWVzLmFjY291bnRJZFxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXBwSW5zaWdodHMuc2V0QXV0aGVudGljYXRlZFVzZXJDb250ZXh0KFxyXG4gICAgICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmFwcEluc2lnaHRzLnVzZXJJZFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=