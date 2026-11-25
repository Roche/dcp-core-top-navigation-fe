import { Inject, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DefaultConfig } from './angulartics2-config';
import { ANGULARTICS2_TOKEN } from './angulartics2-token';
import * as i0 from "@angular/core";
import * as i1 from "./routerless";
export class Angulartics2 {
    tracker;
    settings;
    pageTrack = new ReplaySubject(10);
    eventTrack = new ReplaySubject(10);
    exceptionTrack = new ReplaySubject(10);
    setAlias = new ReplaySubject(10);
    setUsername = new ReplaySubject(10);
    setUserProperties = new ReplaySubject(10);
    setUserPropertiesOnce = new ReplaySubject(10);
    setSuperProperties = new ReplaySubject(10);
    setSuperPropertiesOnce = new ReplaySubject(10);
    userTimings = new ReplaySubject(10);
    constructor(tracker, setup) {
        this.tracker = tracker;
        const defaultConfig = new DefaultConfig();
        this.settings = { ...defaultConfig, ...setup.settings };
        this.settings.pageTracking = {
            ...defaultConfig.pageTracking,
            ...setup.settings.pageTracking,
        };
        this.tracker
            .trackLocation(this.settings)
            .subscribe((event) => this.trackUrlChange(event.url));
    }
    /** filters all events when developer mode is true */
    filterDeveloperMode() {
        return filter((value, index) => !this.settings.developerMode);
    }
    trackUrlChange(url) {
        if (this.settings.pageTracking.autoTrackVirtualPages && !this.matchesExcludedRoute(url)) {
            const clearedUrl = this.clearUrl(url);
            let path;
            if (this.settings.pageTracking.basePath.length) {
                path = this.settings.pageTracking.basePath + clearedUrl;
            }
            else {
                path = this.tracker.prepareExternalUrl(clearedUrl);
            }
            this.pageTrack.next({ path });
        }
    }
    /**
     * Use string literals or regular expressions to exclude routes
     * from automatic pageview tracking.
     *
     * @param url location
     */
    matchesExcludedRoute(url) {
        for (const excludedRoute of this.settings.pageTracking.excludedRoutes) {
            const matchesRegex = excludedRoute instanceof RegExp && excludedRoute.test(url);
            if (matchesRegex || url.indexOf(excludedRoute) !== -1) {
                return true;
            }
        }
        return false;
    }
    /**
     * Removes id's from tracked route.
     *  EX: `/project/12981/feature` becomes `/project/feature`
     *
     * @param url current page path
     */
    clearUrl(url) {
        if (this.settings.pageTracking.clearIds ||
            this.settings.pageTracking.clearQueryParams ||
            this.settings.pageTracking.clearHash) {
            return url
                .split('/')
                .map(part => (this.settings.pageTracking.clearQueryParams ? part.split('?')[0] : part))
                .map(part => (this.settings.pageTracking.clearHash ? part.split('#')[0] : part))
                .filter(part => !this.settings.pageTracking.clearIds ||
                !part.match(this.settings.pageTracking.idsRegExp))
                .join('/');
        }
        return url;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2, deps: [{ token: i1.RouterlessTracking }, { token: ANGULARTICS2_TOKEN }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.RouterlessTracking }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ANGULARTICS2_TOKEN]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcnRpY3MyLWNvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL2FuZ3VsYXJ0aWNzMi1jb3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5ELE9BQU8sRUFBNEIsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9ELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QyxPQUFPLEVBQXdCLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTVFLE9BQU8sRUFBcUIsa0JBQWtCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBSTdFLE1BQU0sT0FBTyxZQUFZO0lBZWI7SUFkVixRQUFRLENBQXVCO0lBRS9CLFNBQVMsR0FBRyxJQUFJLGFBQWEsQ0FBcUIsRUFBRSxDQUFDLENBQUM7SUFDdEQsVUFBVSxHQUFHLElBQUksYUFBYSxDQUFzQixFQUFFLENBQUMsQ0FBQztJQUN4RCxjQUFjLEdBQUcsSUFBSSxhQUFhLENBQU0sRUFBRSxDQUFDLENBQUM7SUFDNUMsUUFBUSxHQUFHLElBQUksYUFBYSxDQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLFdBQVcsR0FBRyxJQUFJLGFBQWEsQ0FBdUMsRUFBRSxDQUFDLENBQUM7SUFDMUUsaUJBQWlCLEdBQUcsSUFBSSxhQUFhLENBQU0sRUFBRSxDQUFDLENBQUM7SUFDL0MscUJBQXFCLEdBQUcsSUFBSSxhQUFhLENBQU0sRUFBRSxDQUFDLENBQUM7SUFDbkQsa0JBQWtCLEdBQUcsSUFBSSxhQUFhLENBQU0sRUFBRSxDQUFDLENBQUM7SUFDaEQsc0JBQXNCLEdBQUcsSUFBSSxhQUFhLENBQU0sRUFBRSxDQUFDLENBQUM7SUFDcEQsV0FBVyxHQUFHLElBQUksYUFBYSxDQUFjLEVBQUUsQ0FBQyxDQUFDO0lBRWpELFlBQ1UsT0FBMkIsRUFDUCxLQUF3QjtR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QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDL0UsTUFBTSxDQUNMLElBQUksQ0FBQyxFQUFFLENBQ0wsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRO2dCQUNwQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQ3BEO2lCQUNBLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNkO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO3dHQXZGVSxZQUFZLG9EQWdCYixrQkFBa0I7NEdBaEJqQixZQUFZLGNBREMsTUFBTTs7NEZBQ25CLFlBQVk7a0JBRHhCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzswQkFpQjdCLE1BQU07MkJBQUMsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuaW1wb3J0IHsgQW5ndWxhcnRpY3MyU2V0dGluZ3MsIERlZmF1bHRDb25maWcgfSBmcm9tICcuL2FuZ3VsYXJ0aWNzMi1jb25maWcnO1xyXG5pbXBvcnQgeyBFdmVudFRyYWNrLCBQYWdlVHJhY2ssIFVzZXJUaW1pbmdzIH0gZnJvbSAnLi9hbmd1bGFydGljczItaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IEFuZ3VsYXJ0aWNzMlRva2VuLCBBTkdVTEFSVElDUzJfVE9LRU4gfSBmcm9tICcuL2FuZ3VsYXJ0aWNzMi10b2tlbic7XHJcbmltcG9ydCB7IFJvdXRlcmxlc3NUcmFja2luZywgVHJhY2tOYXZpZ2F0aW9uRW5kIH0gZnJvbSAnLi9yb3V0ZXJsZXNzJztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFydGljczIge1xyXG4gIHNldHRpbmdzOiBBbmd1bGFydGljczJTZXR0aW5ncztcclxuXHJcbiAgcGFnZVRyYWNrID0gbmV3IFJlcGxheVN1YmplY3Q8UGFydGlhbDxQYWdlVHJhY2s+PigxMCk7XHJcbiAgZXZlbnRUcmFjayA9IG5ldyBSZXBsYXlTdWJqZWN0PFBhcnRpYWw8RXZlbnRUcmFjaz4+KDEwKTtcclxuICBleGNlcHRpb25UcmFjayA9IG5ldyBSZXBsYXlTdWJqZWN0PGFueT4oMTApO1xyXG4gIHNldEFsaWFzID0gbmV3IFJlcGxheVN1YmplY3Q8c3RyaW5nPigxMCk7XHJcbiAgc2V0VXNlcm5hbWUgPSBuZXcgUmVwbGF5U3ViamVjdDx7IHVzZXJJZDogc3RyaW5nIHwgbnVtYmVyIH0gfCBzdHJpbmc+KDEwKTtcclxuICBzZXRVc2VyUHJvcGVydGllcyA9IG5ldyBSZXBsYXlTdWJqZWN0PGFueT4oMTApO1xyXG4gIHNldFVzZXJQcm9wZXJ0aWVzT25jZSA9IG5ldyBSZXBsYXlTdWJqZWN0PGFueT4oMTApO1xyXG4gIHNldFN1cGVyUHJvcGVydGllcyA9IG5ldyBSZXBsYXlTdWJqZWN0PGFueT4oMTApO1xyXG4gIHNldFN1cGVyUHJvcGVydGllc09uY2UgPSBuZXcgUmVwbGF5U3ViamVjdDxhbnk+KDEwKTtcclxuICB1c2VyVGltaW5ncyA9IG5ldyBSZXBsYXlTdWJqZWN0PFVzZXJUaW1pbmdzPigxMCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSB0cmFja2VyOiBSb3V0ZXJsZXNzVHJhY2tpbmcsXHJcbiAgICBASW5qZWN0KEFOR1VMQVJUSUNTMl9UT0tFTikgc2V0dXA6IEFuZ3VsYXJ0aWNzMlRva2VuLFxyXG4gICkge1xyXG4gICAgY29uc3QgZGVmYXVsdENvbmZpZyA9IG5ldyBEZWZhdWx0Q29uZmlnKCk7XHJcbiAgICB0aGlzLnNldHRpbmdzID0geyAuLi5kZWZhdWx0Q29uZmlnLCAuLi5zZXR1cC5zZXR0aW5ncyB9O1xyXG4gICAgdGhpcy5zZXR0aW5ncy5wYWdlVHJhY2tpbmcgPSB7XHJcbiAgICAgIC4uLmRlZmF1bHRDb25maWcucGFnZVRyYWNraW5nLFxyXG4gICAgICAuLi5zZXR1cC5zZXR0aW5ncy5wYWdlVHJhY2tpbmcsXHJcbiAgICB9O1xyXG4gICAgdGhpcy50cmFja2VyXHJcbiAgICAgIC50cmFja0xvY2F0aW9uKHRoaXMuc2V0dGluZ3MpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBUcmFja05hdmlnYXRpb25FbmQpID0+IHRoaXMudHJhY2tVcmxDaGFuZ2UoZXZlbnQudXJsKSk7XHJcbiAgfVxyXG5cclxuICAvKiogZmlsdGVycyBhbGwgZXZlbnRzIHdoZW4gZGV2ZWxvcGVyIG1vZGUgaXMgdHJ1ZSAqL1xyXG4gIGZpbHRlckRldmVsb3Blck1vZGU8VD4oKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcclxuICAgIHJldHVybiBmaWx0ZXIoKHZhbHVlLCBpbmRleCkgPT4gIXRoaXMuc2V0dGluZ3MuZGV2ZWxvcGVyTW9kZSk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgdHJhY2tVcmxDaGFuZ2UodXJsOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLnNldHRpbmdzLnBhZ2VUcmFja2luZy5hdXRvVHJhY2tWaXJ0dWFsUGFnZXMgJiYgIXRoaXMubWF0Y2hlc0V4Y2x1ZGVkUm91dGUodXJsKSkge1xyXG4gICAgICBjb25zdCBjbGVhcmVkVXJsID0gdGhpcy5jbGVhclVybCh1cmwpO1xyXG4gICAgICBsZXQgcGF0aDogc3RyaW5nO1xyXG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5wYWdlVHJhY2tpbmcuYmFzZVBhdGgubGVuZ3RoKSB7XHJcbiAgICAgICAgcGF0aCA9IHRoaXMuc2V0dGluZ3MucGFnZVRyYWNraW5nLmJhc2VQYXRoICsgY2xlYXJlZFVybDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBwYXRoID0gdGhpcy50cmFja2VyLnByZXBhcmVFeHRlcm5hbFVybChjbGVhcmVkVXJsKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnBhZ2VUcmFjay5uZXh0KHsgcGF0aCB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVzZSBzdHJpbmcgbGl0ZXJhbHMgb3IgcmVndWxhciBleHByZXNzaW9ucyB0byBleGNsdWRlIHJvdXRlc1xyXG4gICAqIGZyb20gYXV0b21hdGljIHBhZ2V2aWV3IHRyYWNraW5nLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHVybCBsb2NhdGlvblxyXG4gICAqL1xyXG4gIHByb3RlY3RlZCBtYXRjaGVzRXhjbHVkZWRSb3V0ZSh1cmw6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgZm9yIChjb25zdCBleGNsdWRlZFJvdXRlIG9mIHRoaXMuc2V0dGluZ3MucGFnZVRyYWNraW5nLmV4Y2x1ZGVkUm91dGVzKSB7XHJcbiAgICAgIGNvbnN0IG1hdGNoZXNSZWdleCA9IGV4Y2x1ZGVkUm91dGUgaW5zdGFuY2VvZiBSZWdFeHAgJiYgZXhjbHVkZWRSb3V0ZS50ZXN0KHVybCk7XHJcbiAgICAgIGlmIChtYXRjaGVzUmVnZXggfHwgdXJsLmluZGV4T2YoZXhjbHVkZWRSb3V0ZSBhcyBzdHJpbmcpICE9PSAtMSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIGlkJ3MgZnJvbSB0cmFja2VkIHJvdXRlLlxyXG4gICAqICBFWDogYC9wcm9qZWN0LzEyOTgxL2ZlYXR1cmVgIGJlY29tZXMgYC9wcm9qZWN0L2ZlYXR1cmVgXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXJsIGN1cnJlbnQgcGFnZSBwYXRoXHJcbiAgICovXHJcbiAgcHJvdGVjdGVkIGNsZWFyVXJsKHVybDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmIChcclxuICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlVHJhY2tpbmcuY2xlYXJJZHMgfHxcclxuICAgICAgdGhpcy5zZXR0aW5ncy5wYWdlVHJhY2tpbmcuY2xlYXJRdWVyeVBhcmFtcyB8fFxyXG4gICAgICB0aGlzLnNldHRpbmdzLnBhZ2VUcmFja2luZy5jbGVhckhhc2hcclxuICAgICkge1xyXG4gICAgICByZXR1cm4gdXJsXHJcbiAgICAgICAgLnNwbGl0KCcvJylcclxuICAgICAgICAubWFwKHBhcnQgPT4gKHRoaXMuc2V0dGluZ3MucGFnZVRyYWNraW5nLmNsZWFyUXVlcnlQYXJhbXMgPyBwYXJ0LnNwbGl0KCc/JylbMF0gOiBwYXJ0KSlcclxuICAgICAgICAubWFwKHBhcnQgPT4gKHRoaXMuc2V0dGluZ3MucGFnZVRyYWNraW5nLmNsZWFySGFzaCA/IHBhcnQuc3BsaXQoJyMnKVswXSA6IHBhcnQpKVxyXG4gICAgICAgIC5maWx0ZXIoXHJcbiAgICAgICAgICBwYXJ0ID0+XHJcbiAgICAgICAgICAgICF0aGlzLnNldHRpbmdzLnBhZ2VUcmFja2luZy5jbGVhcklkcyB8fFxyXG4gICAgICAgICAgICAhcGFydC5tYXRjaCh0aGlzLnNldHRpbmdzLnBhZ2VUcmFja2luZy5pZHNSZWdFeHApLFxyXG4gICAgICAgIClcclxuICAgICAgICAuam9pbignLycpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybDtcclxuICB9XHJcbn1cclxuIl19