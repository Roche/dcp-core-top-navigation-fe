import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
export class Angulartics2BaiduAnalytics {
    angulartics2;
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
        if (typeof _hmt === 'undefined') {
            _hmt = [];
        }
        else {
            _hmt.push(['_setAutoPageview', false]);
        }
        this.angulartics2.setUsername
            .subscribe((x) => this.setUsername(x));
        this.angulartics2.setUserProperties
            .subscribe((x) => this.setUserProperties(x));
    }
    startTracking() {
        this.angulartics2.pageTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.pageTrack(x.path));
        this.angulartics2.eventTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.eventTrack(x.action, x.properties));
    }
    /**
     * Page Track in Baidu Analytics
     *
     * @param path Required url 'path'
     *
     * @link http://tongji.baidu.com/open/api/more?p=ref_trackPageview
     */
    pageTrack(path) {
        if (typeof _hmt !== 'undefined' && _hmt) {
            _hmt.push(['_trackPageview', path]);
        }
    }
    /**
     * Track Event in Baidu Analytics
     *
     * @param action Name associated with the event
     * @param properties Comprised of:
     *  - 'category' (string)
     *  - 'opt_label' (string)
     *  - 'opt_value' (string)
     *
     * @link http://tongji.baidu.com/open/api/more?p=ref_trackEvent
     */
    eventTrack(action, properties) {
        // baidu analytics requires category
        if (!properties || !properties.category) {
            properties = properties || {};
            properties.category = 'Event';
            properties.opt_label = 'default';
            properties.opt_value = 'default';
        }
        if (typeof _hmt !== 'undefined' && _hmt) {
            _hmt.push([
                '_trackEvent',
                properties.category,
                action,
                properties.opt_label,
                properties.opt_value,
            ]);
        }
    }
    setUsername(userId) {
        // set default custom variables name to 'identity' and 'value'
        _hmt.push(['_setCustomVar', 1, 'identity', userId]);
    }
    setUserProperties(properties) {
        _hmt.push(['_setCustomVar', 2, 'user', JSON.stringify(properties)]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2BaiduAnalytics, deps: [{ token: i1.Angulartics2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2BaiduAnalytics, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2BaiduAnalytics, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFpZHUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Byb3ZpZGVycy9iYWlkdS9iYWlkdS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFRM0MsTUFBTSxPQUFPLDBCQUEwQjtJQUNqQjtJQUFwQixZQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUM1QyxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUMvQixJQUFJLEdBQUcsRUFBRSxDQUFDO1NBQ1g7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXO2FBQzFCLFNBQVMsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCO2FBQ2hDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7YUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVO2FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDN0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFNBQVMsQ0FBQyxJQUFZO1FBQ3BCLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksRUFBRTtZQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsVUFBVSxDQUFDLE1BQWMsRUFBRSxVQUFlO1FBQ3hDLG9DQUFvQztRQUNwQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUN2QyxVQUFVLEdBQUcsVUFBVSxJQUFJLEVBQUUsQ0FBQztZQUM5QixVQUFVLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUM5QixVQUFVLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztZQUNqQyxVQUFVLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztTQUNsQztRQUVELElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksRUFBRTtZQUN2QyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNSLGFBQWE7Z0JBQ2IsVUFBVSxDQUFDLFFBQVE7Z0JBQ25CLE1BQU07Z0JBQ04sVUFBVSxDQUFDLFNBQVM7Z0JBQ3BCLFVBQVUsQ0FBQyxTQUFTO2FBQ3JCLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFjO1FBQ3hCLDhEQUE4RDtRQUM5RCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsVUFBZTtRQUMvQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQzt3R0F6RVUsMEJBQTBCOzRHQUExQiwwQkFBMEIsY0FEYixNQUFNOzs0RkFDbkIsMEJBQTBCO2tCQUR0QyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IEFuZ3VsYXJ0aWNzMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXJ0aWNzMi1jb3JlJztcclxuXHJcblxyXG5kZWNsYXJlIHZhciBfaG10OiBhbnk7XHJcblxyXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhcnRpY3MyQmFpZHVBbmFseXRpY3Mge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYW5ndWxhcnRpY3MyOiBBbmd1bGFydGljczIpIHtcclxuICAgIGlmICh0eXBlb2YgX2htdCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgX2htdCA9IFtdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgX2htdC5wdXNoKFsnX3NldEF1dG9QYWdldmlldycsIGZhbHNlXSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXRVc2VybmFtZVxyXG4gICAgICAuc3Vic2NyaWJlKCh4OiBzdHJpbmcpID0+IHRoaXMuc2V0VXNlcm5hbWUoeCkpO1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIuc2V0VXNlclByb3BlcnRpZXNcclxuICAgICAgLnN1YnNjcmliZSgoeCkgPT4gdGhpcy5zZXRVc2VyUHJvcGVydGllcyh4KSk7XHJcbiAgfVxyXG5cclxuICBzdGFydFRyYWNraW5nKCk6IHZvaWQge1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIucGFnZVRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSgoeCkgPT4gdGhpcy5wYWdlVHJhY2soeC5wYXRoKSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5ldmVudFRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSgoeCkgPT4gdGhpcy5ldmVudFRyYWNrKHguYWN0aW9uLCB4LnByb3BlcnRpZXMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhZ2UgVHJhY2sgaW4gQmFpZHUgQW5hbHl0aWNzXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcGF0aCBSZXF1aXJlZCB1cmwgJ3BhdGgnXHJcbiAgICpcclxuICAgKiBAbGluayBodHRwOi8vdG9uZ2ppLmJhaWR1LmNvbS9vcGVuL2FwaS9tb3JlP3A9cmVmX3RyYWNrUGFnZXZpZXdcclxuICAgKi9cclxuICBwYWdlVHJhY2socGF0aDogc3RyaW5nKSB7XHJcbiAgICBpZiAodHlwZW9mIF9obXQgIT09ICd1bmRlZmluZWQnICYmIF9obXQpIHtcclxuICAgICAgX2htdC5wdXNoKFsnX3RyYWNrUGFnZXZpZXcnLCBwYXRoXSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBUcmFjayBFdmVudCBpbiBCYWlkdSBBbmFseXRpY3NcclxuICAgKlxyXG4gICAqIEBwYXJhbSBhY3Rpb24gTmFtZSBhc3NvY2lhdGVkIHdpdGggdGhlIGV2ZW50XHJcbiAgICogQHBhcmFtIHByb3BlcnRpZXMgQ29tcHJpc2VkIG9mOlxyXG4gICAqICAtICdjYXRlZ29yeScgKHN0cmluZylcclxuICAgKiAgLSAnb3B0X2xhYmVsJyAoc3RyaW5nKVxyXG4gICAqICAtICdvcHRfdmFsdWUnIChzdHJpbmcpXHJcbiAgICpcclxuICAgKiBAbGluayBodHRwOi8vdG9uZ2ppLmJhaWR1LmNvbS9vcGVuL2FwaS9tb3JlP3A9cmVmX3RyYWNrRXZlbnRcclxuICAgKi9cclxuICBldmVudFRyYWNrKGFjdGlvbjogc3RyaW5nLCBwcm9wZXJ0aWVzOiBhbnkpIHtcclxuICAgIC8vIGJhaWR1IGFuYWx5dGljcyByZXF1aXJlcyBjYXRlZ29yeVxyXG4gICAgaWYgKCFwcm9wZXJ0aWVzIHx8ICFwcm9wZXJ0aWVzLmNhdGVnb3J5KSB7XHJcbiAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzIHx8IHt9O1xyXG4gICAgICBwcm9wZXJ0aWVzLmNhdGVnb3J5ID0gJ0V2ZW50JztcclxuICAgICAgcHJvcGVydGllcy5vcHRfbGFiZWwgPSAnZGVmYXVsdCc7XHJcbiAgICAgIHByb3BlcnRpZXMub3B0X3ZhbHVlID0gJ2RlZmF1bHQnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgX2htdCAhPT0gJ3VuZGVmaW5lZCcgJiYgX2htdCkge1xyXG4gICAgICBfaG10LnB1c2goW1xyXG4gICAgICAgICdfdHJhY2tFdmVudCcsXHJcbiAgICAgICAgcHJvcGVydGllcy5jYXRlZ29yeSxcclxuICAgICAgICBhY3Rpb24sXHJcbiAgICAgICAgcHJvcGVydGllcy5vcHRfbGFiZWwsXHJcbiAgICAgICAgcHJvcGVydGllcy5vcHRfdmFsdWUsXHJcbiAgICAgIF0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0VXNlcm5hbWUodXNlcklkOiBzdHJpbmcpIHtcclxuICAgIC8vIHNldCBkZWZhdWx0IGN1c3RvbSB2YXJpYWJsZXMgbmFtZSB0byAnaWRlbnRpdHknIGFuZCAndmFsdWUnXHJcbiAgICBfaG10LnB1c2goWydfc2V0Q3VzdG9tVmFyJywgMSwgJ2lkZW50aXR5JywgdXNlcklkXSk7XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpIHtcclxuICAgIF9obXQucHVzaChbJ19zZXRDdXN0b21WYXInLCAyLCAndXNlcicsIEpTT04uc3RyaW5naWZ5KHByb3BlcnRpZXMpXSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==