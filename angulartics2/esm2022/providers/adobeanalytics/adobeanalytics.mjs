import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
import * as i2 from "@angular/common";
export class Angulartics2AdobeAnalytics {
    angulartics2;
    location;
    constructor(angulartics2, location) {
        this.angulartics2 = angulartics2;
        this.location = location;
        this.angulartics2.setUserProperties.subscribe(x => this.setUserProperties(x));
    }
    startTracking() {
        this.angulartics2.pageTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.pageTrack(x.path));
        this.angulartics2.eventTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.eventTrack(x.action, x.properties));
    }
    pageTrack(path) {
        if (typeof s !== 'undefined' && s) {
            s.clearVars();
            s.t({ pageName: path });
        }
    }
    /**
     * Track Event in Adobe Analytics
     *
     * @param action associated with the event
     * @param properties action detials
     *
     * @link https://marketing.adobe.com/resources/help/en_US/sc/implement/js_implementation.html
     */
    eventTrack(action, properties) {
        // TODO: make interface
        // @property {string} properties.category
        // @property {string} properties.label
        // @property {number} properties.value
        // @property {boolean} properties.noninteraction
        if (!properties) {
            properties = properties || {};
        }
        if (typeof s !== 'undefined' && s) {
            if (typeof properties === 'object') {
                this.setUserProperties(properties);
            }
            if (action) {
                // if linkName property is passed, use that; otherwise, the action is the linkName
                const linkName = properties['linkName'] ? properties['linkName'] : action;
                // note that 'this' should refer the link element, but we can't get that in this function. example:
                // <a href="http://anothersite.com" onclick="s.tl(this,'e','AnotherSite',null)">
                // if disableDelay property is passed, use that to turn off/on the 500ms delay; otherwise, it uses this
                const disableDelay = !!properties['disableDelay'] ? true : this;
                // if action property is passed, use that; otherwise, the action remains unchanged
                if (properties['action']) {
                    action = properties['action'];
                }
                this.setPageName();
                if (action.toUpperCase() === 'DOWNLOAD') {
                    s.tl(disableDelay, 'd', linkName);
                }
                else if (action.toUpperCase() === 'EXIT') {
                    s.tl(disableDelay, 'e', linkName);
                }
                else {
                    s.tl(disableDelay, 'o', linkName);
                }
            }
        }
    }
    setPageName() {
        const path = this.location.path(true);
        const hashNdx = path.indexOf('#');
        if (hashNdx > 0 && hashNdx < path.length) {
            s.pageName = path.substring(hashNdx + 1);
        }
        else {
            s.pageName = path;
        }
    }
    setUserProperties(properties) {
        if (typeof s !== 'undefined' && s) {
            if (typeof properties === 'object') {
                for (const key in properties) {
                    if (properties.hasOwnProperty(key)) {
                        s[key] = properties[key];
                    }
                }
            }
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2AdobeAnalytics, deps: [{ token: i1.Angulartics2 }, { token: i2.Location }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2AdobeAnalytics, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2AdobeAnalytics, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }, { type: i2.Location }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRvYmVhbmFseXRpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Byb3ZpZGVycy9hZG9iZWFuYWx5dGljcy9hZG9iZWFuYWx5dGljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBTzNDLE1BQU0sT0FBTywwQkFBMEI7SUFDakI7SUFBb0M7SUFBeEQsWUFBb0IsWUFBMEIsRUFBVSxRQUFrQjtRQUF0RCxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDeEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUzthQUN4QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQzdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVO2FBQ3pCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDN0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxTQUFTLENBQUMsSUFBWTtRQUNwQixJQUFJLE9BQU8sQ0FBQyxLQUFLLFdBQVcsSUFBSSxDQUFDLEVBQUU7WUFDakMsQ0FBQyxDQUFDLFNB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QUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBBbmd1bGFydGljczIgfSBmcm9tICcuLi8uLi9hbmd1bGFydGljczItY29yZSc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IHM6IGFueTtcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFydGljczJBZG9iZUFuYWx5dGljcyB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhbmd1bGFydGljczI6IEFuZ3VsYXJ0aWNzMiwgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb24pIHtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldFVzZXJQcm9wZXJ0aWVzLnN1YnNjcmliZSh4ID0+IHRoaXMuc2V0VXNlclByb3BlcnRpZXMoeCkpO1xyXG4gIH1cclxuXHJcbiAgc3RhcnRUcmFja2luZygpOiB2b2lkIHtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnBhZ2VUcmFja1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiB0aGlzLnBhZ2VUcmFjayh4LnBhdGgpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLmV2ZW50VHJhY2tcclxuICAgICAgLnBpcGUodGhpcy5hbmd1bGFydGljczIuZmlsdGVyRGV2ZWxvcGVyTW9kZSgpKVxyXG4gICAgICAuc3Vic2NyaWJlKHggPT4gdGhpcy5ldmVudFRyYWNrKHguYWN0aW9uLCB4LnByb3BlcnRpZXMpKTtcclxuICB9XHJcblxyXG4gIHBhZ2VUcmFjayhwYXRoOiBzdHJpbmcpIHtcclxuICAgIGlmICh0eXBlb2YgcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcykge1xyXG4gICAgICBzLmNsZWFyVmFycygpO1xyXG4gICAgICBzLnQoeyBwYWdlTmFtZTogcGF0aCB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNrIEV2ZW50IGluIEFkb2JlIEFuYWx5dGljc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIGFjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGV2ZW50XHJcbiAgICogQHBhcmFtIHByb3BlcnRpZXMgYWN0aW9uIGRldGlhbHNcclxuICAgKlxyXG4gICAqIEBsaW5rIGh0dHBzOi8vbWFya2V0aW5nLmFkb2JlLmNvbS9yZXNvdXJjZXMvaGVscC9lbl9VUy9zYy9pbXBsZW1lbnQvanNfaW1wbGVtZW50YXRpb24uaHRtbFxyXG4gICAqL1xyXG4gIGV2ZW50VHJhY2soYWN0aW9uOiBzdHJpbmcsIHByb3BlcnRpZXM6IGFueSkge1xyXG4gICAgLy8gVE9ETzogbWFrZSBpbnRlcmZhY2VcclxuICAgIC8vIEBwcm9wZXJ0eSB7c3RyaW5nfSBwcm9wZXJ0aWVzLmNhdGVnb3J5XHJcbiAgICAvLyBAcHJvcGVydHkge3N0cmluZ30gcHJvcGVydGllcy5sYWJlbFxyXG4gICAgLy8gQHByb3BlcnR5IHtudW1iZXJ9IHByb3BlcnRpZXMudmFsdWVcclxuICAgIC8vIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gcHJvcGVydGllcy5ub25pbnRlcmFjdGlvblxyXG4gICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzIHx8IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcykge1xyXG4gICAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgdGhpcy5zZXRVc2VyUHJvcGVydGllcyhwcm9wZXJ0aWVzKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoYWN0aW9uKSB7XHJcbiAgICAgICAgLy8gaWYgbGlua05hbWUgcHJvcGVydHkgaXMgcGFzc2VkLCB1c2UgdGhhdDsgb3RoZXJ3aXNlLCB0aGUgYWN0aW9uIGlzIHRoZSBsaW5rTmFtZVxyXG4gICAgICAgIGNvbnN0IGxpbmtOYW1lID0gcHJvcGVydGllc1snbGlua05hbWUnXSA/IHByb3BlcnRpZXNbJ2xpbmtOYW1lJ10gOiBhY3Rpb247XHJcbiAgICAgICAgLy8gbm90ZSB0aGF0ICd0aGlzJyBzaG91bGQgcmVmZXIgdGhlIGxpbmsgZWxlbWVudCwgYnV0IHdlIGNhbid0IGdldCB0aGF0IGluIHRoaXMgZnVuY3Rpb24uIGV4YW1wbGU6XHJcbiAgICAgICAgLy8gPGEgaHJlZj1cImh0dHA6Ly9hbm90aGVyc2l0ZS5jb21cIiBvbmNsaWNrPVwicy50bCh0aGlzLCdlJywnQW5vdGhlclNpdGUnLG51bGwpXCI+XHJcbiAgICAgICAgLy8gaWYgZGlzYWJsZURlbGF5IHByb3BlcnR5IGlzIHBhc3NlZCwgdXNlIHRoYXQgdG8gdHVybiBvZmYvb24gdGhlIDUwMG1zIGRlbGF5OyBvdGhlcndpc2UsIGl0IHVzZXMgdGhpc1xyXG4gICAgICAgIGNvbnN0IGRpc2FibGVEZWxheSA9ICEhcHJvcGVydGllc1snZGlzYWJsZURlbGF5J10gPyB0cnVlIDogdGhpcztcclxuICAgICAgICAvLyBpZiBhY3Rpb24gcHJvcGVydHkgaXMgcGFzc2VkLCB1c2UgdGhhdDsgb3RoZXJ3aXNlLCB0aGUgYWN0aW9uIHJlbWFpbnMgdW5jaGFuZ2VkXHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXNbJ2FjdGlvbiddKSB7XHJcbiAgICAgICAgICBhY3Rpb24gPSBwcm9wZXJ0aWVzWydhY3Rpb24nXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRQYWdlTmFtZSgpO1xyXG5cclxuICAgICAgICBpZiAoYWN0aW9uLnRvVXBwZXJDYXNlKCkgPT09ICdET1dOTE9BRCcpIHtcclxuICAgICAgICAgIHMudGwoZGlzYWJsZURlbGF5LCAnZCcsIGxpbmtOYW1lKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbi50b1VwcGVyQ2FzZSgpID09PSAnRVhJVCcpIHtcclxuICAgICAgICAgIHMudGwoZGlzYWJsZURlbGF5LCAnZScsIGxpbmtOYW1lKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcy50bChkaXNhYmxlRGVsYXksICdvJywgbGlua05hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRQYWdlTmFtZSgpIHtcclxuICAgIGNvbnN0IHBhdGggPSB0aGlzLmxvY2F0aW9uLnBhdGgodHJ1ZSk7XHJcbiAgICBjb25zdCBoYXNoTmR4ID0gcGF0aC5pbmRleE9mKCcjJyk7XHJcbiAgICBpZiAoaGFzaE5keCA+IDAgJiYgaGFzaE5keCA8IHBhdGgubGVuZ3RoKSB7XHJcbiAgICAgIHMucGFnZU5hbWUgPSBwYXRoLnN1YnN0cmluZyhoYXNoTmR4ICsgMSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzLnBhZ2VOYW1lID0gcGF0aDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldFVzZXJQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IGFueSkge1xyXG4gICAgaWYgKHR5cGVvZiBzICE9PSAndW5kZWZpbmVkJyAmJiBzKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICAgIHNba2V5XSA9IHByb3BlcnRpZXNba2V5XTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19