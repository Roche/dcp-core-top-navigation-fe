import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
export class GoogleAnalyticsDefaults {
    additionalAccountNames = [];
    userId = null;
    transport = '';
    anonymizeIp = false;
}
export class Angulartics2GoogleAnalytics {
    angulartics2;
    dimensionsAndMetrics = [];
    settings;
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
        const defaults = new GoogleAnalyticsDefaults();
        // Set the default settings for this module
        this.angulartics2.settings.ga = {
            ...defaults,
            ...this.angulartics2.settings.ga,
        };
        this.settings = this.angulartics2.settings.ga;
        this.angulartics2.setUsername.subscribe((x) => this.setUsername(x));
        this.angulartics2.setUserProperties.subscribe(x => this.setUserProperties(x));
    }
    startTracking() {
        this.angulartics2.pageTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.pageTrack(x.path));
        this.angulartics2.eventTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.eventTrack(x.action, x.properties));
        this.angulartics2.exceptionTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.exceptionTrack(x));
        this.angulartics2.userTimings
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.userTimings(x));
    }
    pageTrack(path) {
        if (typeof _gaq !== 'undefined' && _gaq) {
            _gaq.push(['_trackPageview', path]);
            for (const accountName of this.angulartics2.settings.ga.additionalAccountNames) {
                _gaq.push([accountName + '._trackPageview', path]);
            }
        }
        if (typeof ga !== 'undefined' && ga) {
            if (this.angulartics2.settings.ga.userId) {
                ga('set', '&uid', this.angulartics2.settings.ga.userId);
                for (const accountName of this.angulartics2.settings.ga.additionalAccountNames) {
                    ga(accountName + '.set', '&uid', this.angulartics2.settings.ga.userId);
                }
            }
            if (this.angulartics2.settings.ga.anonymizeIp) {
                ga('set', 'anonymizeIp', true);
                for (const accountName of this.angulartics2.settings.ga.additionalAccountNames) {
                    ga(accountName + '.set', 'anonymizeIp', true);
                }
            }
            ga('send', 'pageview', path);
            for (const accountName of this.angulartics2.settings.ga.additionalAccountNames) {
                ga(accountName + '.send', 'pageview', path);
            }
        }
    }
    /**
     * Track Event in GA
     *
     * @param action Associated with the event
     * @param properties Comprised of:
     *  - category (string) and optional
     *  - label (string)
     *  - value (integer)
     *  - noninteraction (boolean)
     *
     * @link https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
     * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/events
     */
    eventTrack(action, properties) {
        // Google Analytics requires an Event Category
        if (!properties || !properties.category) {
            properties = properties || {};
            properties.category = 'Event';
        }
        // GA requires that eventValue be an integer, see:
        // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#eventValue
        // https://github.com/luisfarzati/angulartics/issues/81
        if (properties.value) {
            const parsed = parseInt(properties.value, 10);
            properties.value = isNaN(parsed) ? 0 : parsed;
        }
        if (typeof ga !== 'undefined') {
            const eventOptions = {
                eventCategory: properties.category,
                eventAction: action,
                eventLabel: properties.label,
                eventValue: properties.value,
                nonInteraction: properties.noninteraction,
                page: properties.page || location.hash.substring(1) || location.pathname,
                userId: this.angulartics2.settings.ga.userId,
                hitCallback: properties.hitCallback,
                ...(this.angulartics2.settings.ga.transport && {
                    transport: this.angulartics2.settings.ga.transport,
                }),
            };
            // add custom dimensions and metrics
            this.setDimensionsAndMetrics(properties);
            ga('send', 'event', eventOptions);
            for (const accountName of this.angulartics2.settings.ga.additionalAccountNames) {
                ga(accountName + '.send', 'event', eventOptions);
            }
        }
        else if (typeof _gaq !== 'undefined') {
            _gaq.push([
                '_trackEvent',
                properties.category,
                action,
                properties.label,
                properties.value,
                properties.noninteraction,
            ]);
        }
    }
    /**
     * Exception Track Event in GA
     *
     * @param properties Comprised of the optional fields:
     *  - fatal (string)
     *  - description (string)
     *
     * @https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
     *
     * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/events
     */
    exceptionTrack(properties) {
        if (properties.fatal === undefined) {
            console.log('No "fatal" provided, sending with fatal=true');
            properties.fatal = true;
        }
        properties.exDescription = properties.description;
        const eventOptions = {
            exFatal: properties.fatal,
            exDescription: properties.description,
        };
        ga('send', 'exception', eventOptions);
        for (const accountName of this.angulartics2.settings.ga.additionalAccountNames) {
            ga(accountName + '.send', 'exception', eventOptions);
        }
    }
    /**
     * User Timings Event in GA
     *
     * @param properties Comprised of the mandatory fields:
     *  - timingCategory (string)
     *  - timingVar (string)
     *  - timingValue (number)
     * Properties can also have the optional fields:
     *  - timingLabel (string)
     *
     * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings
     */
    userTimings(properties) {
        if (!properties ||
            !properties.timingCategory ||
            !properties.timingVar ||
            !properties.timingValue) {
            console.error('Properties timingCategory, timingVar, and timingValue are required to be set.');
            return;
        }
        if (typeof ga !== 'undefined') {
            ga('send', 'timing', properties);
            for (const accountName of this.angulartics2.settings.ga.additionalAccountNames) {
                ga(accountName + '.send', 'timing', properties);
            }
        }
    }
    setUsername(userId) {
        this.angulartics2.settings.ga.userId = userId;
        if (typeof ga === 'undefined') {
            return;
        }
        ga('set', 'userId', userId);
    }
    setUserProperties(properties) {
        this.setDimensionsAndMetrics(properties);
    }
    setDimensionsAndMetrics(properties) {
        if (typeof ga === 'undefined') {
            return;
        }
        // clean previously used dimensions and metrics that will not be overriden
        this.dimensionsAndMetrics.forEach(elem => {
            if (!properties.hasOwnProperty(elem)) {
                ga('set', elem, undefined);
                this.angulartics2.settings.ga.additionalAccountNames.forEach((accountName) => {
                    ga(`${accountName}.set`, elem, undefined);
                });
            }
        });
        this.dimensionsAndMetrics = [];
        // add custom dimensions and metrics
        Object.keys(properties).forEach(key => {
            if (key.lastIndexOf('dimension', 0) === 0 || key.lastIndexOf('metric', 0) === 0) {
                ga('set', key, properties[key]);
                this.angulartics2.settings.ga.additionalAccountNames.forEach((accountName) => {
                    ga(`${accountName}.set`, key, properties[key]);
                });
                this.dimensionsAndMetrics.push(key);
            }
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleAnalytics, deps: [{ token: i1.Angulartics2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleAnalytics, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleAnalytics, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2EuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Byb3ZpZGVycy9nYS9nYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFVM0MsTUFBTSxPQUFPLHVCQUF1QjtJQUNsQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7SUFDNUIsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNkLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDZixXQUFXLEdBQUcsS0FBSyxDQUFDO0NBQ3JCO0FBR0QsTUFBTSxPQUFPLDJCQUEyQjtJQUlsQjtJQUhwQixvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFDMUIsUUFBUSxDQUFtQztJQUUzQyxZQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUM1QyxNQUFNLFFBQVEsR0FBRyxJQUFJLHVCQUF1QixFQUFFLENBQUM7UUFDL0MsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRztZQUM5QixHQUFHLFFBQVE7WUFDWCxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7U0FDakMsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELGFBQWE7UUFDWCxJ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R0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDakQsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzt3R0E5TlUsMkJBQTJCOzRHQUEzQiwyQkFBMkIsY0FEZCxNQUFNOzs0RkFDbkIsMkJBQTJCO2tCQUR2QyxVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IEFuZ3VsYXJ0aWNzMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXJ0aWNzMi1jb3JlJztcclxuaW1wb3J0IHsgR29vZ2xlQW5hbHl0aWNzU2V0dGluZ3MgfSBmcm9tICcuLi8uLi9hbmd1bGFydGljczItY29uZmlnJztcclxuaW1wb3J0IHsgVXNlclRpbWluZ3MgfSBmcm9tICcuLi8uLi9hbmd1bGFydGljczItaW50ZXJmYWNlcyc7XHJcblxyXG5kZWNsYXJlIHZhciBfZ2FxOiBHb29nbGVBbmFseXRpY3NDb2RlO1xyXG5kZWNsYXJlIHZhciBnYTogVW5pdmVyc2FsQW5hbHl0aWNzLmdhO1xyXG5kZWNsYXJlIHZhciBsb2NhdGlvbjogYW55O1xyXG5cclxuZXhwb3J0IGNsYXNzIEdvb2dsZUFuYWx5dGljc0RlZmF1bHRzIGltcGxlbWVudHMgR29vZ2xlQW5hbHl0aWNzU2V0dGluZ3Mge1xyXG4gIGFkZGl0aW9uYWxBY2NvdW50TmFtZXMgPSBbXTtcclxuICB1c2VySWQgPSBudWxsO1xyXG4gIHRyYW5zcG9ydCA9ICcnO1xyXG4gIGFub255bWl6ZUlwID0gZmFsc2U7XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFydGljczJHb29nbGVBbmFseXRpY3Mge1xyXG4gIGRpbWVuc2lvbnNBbmRNZXRyaWNzID0gW107XHJcbiAgc2V0dGluZ3M6IFBhcnRpYWw8R29vZ2xlQW5hbHl0aWNzU2V0dGluZ3M+O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFuZ3VsYXJ0aWNzMjogQW5ndWxhcnRpY3MyKSB7XHJcbiAgICBjb25zdCBkZWZhdWx0cyA9IG5ldyBHb29nbGVBbmFseXRpY3NEZWZhdWx0cygpO1xyXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHNldHRpbmdzIGZvciB0aGlzIG1vZHVsZVxyXG4gICAgdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ2EgPSB7XHJcbiAgICAgIC4uLmRlZmF1bHRzLFxyXG4gICAgICAuLi50aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYSxcclxuICAgIH07XHJcbiAgICB0aGlzLnNldHRpbmdzID0gdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ2E7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXRVc2VybmFtZS5zdWJzY3JpYmUoKHg6IHN0cmluZykgPT4gdGhpcy5zZXRVc2VybmFtZSh4KSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXRVc2VyUHJvcGVydGllcy5zdWJzY3JpYmUoeCA9PiB0aGlzLnNldFVzZXJQcm9wZXJ0aWVzKHgpKTtcclxuICB9XHJcblxyXG4gIHN0YXJ0VHJhY2tpbmcoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5wYWdlVHJhY2tcclxuICAgICAgLnBpcGUodGhpcy5hbmd1bGFydGljczIuZmlsdGVyRGV2ZWxvcGVyTW9kZSgpKVxyXG4gICAgICAuc3Vic2NyaWJlKHggPT4gdGhpcy5wYWdlVHJhY2soeC5wYXRoKSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5ldmVudFRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSh4ID0+IHRoaXMuZXZlbnRUcmFjayh4LmFjdGlvbiwgeC5wcm9wZXJ0aWVzKSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5leGNlcHRpb25UcmFja1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiB0aGlzLmV4Y2VwdGlvblRyYWNrKHgpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnVzZXJUaW1pbmdzXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSh4ID0+IHRoaXMudXNlclRpbWluZ3MoeCkpO1xyXG4gIH1cclxuXHJcbiAgcGFnZVRyYWNrKHBhdGg6IHN0cmluZykge1xyXG4gICAgaWYgKHR5cGVvZiBfZ2FxICE9PSAndW5kZWZpbmVkJyAmJiBfZ2FxKSB7XHJcbiAgICAgIF9nYXEucHVzaChbJ190cmFja1BhZ2V2aWV3JywgcGF0aF0pO1xyXG4gICAgICBmb3IgKGNvbnN0IGFjY291bnROYW1lIG9mIHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdhLmFkZGl0aW9uYWxBY2NvdW50TmFtZXMpIHtcclxuICAgICAgICBfZ2FxLnB1c2goW2FjY291bnROYW1lICsgJy5fdHJhY2tQYWdldmlldycsIHBhdGhdKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBnYSAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2EpIHtcclxuICAgICAgaWYgKHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdhLnVzZXJJZCkge1xyXG4gICAgICAgIGdhKCdzZXQnLCAnJnVpZCcsIHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdhLnVzZXJJZCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBhY2NvdW50TmFtZSBvZiB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYS5hZGRpdGlvbmFsQWNjb3VudE5hbWVzKSB7XHJcbiAgICAgICAgICBnYShhY2NvdW50TmFtZSArICcuc2V0JywgJyZ1aWQnLCB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYS51c2VySWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ2EuYW5vbnltaXplSXApIHtcclxuICAgICAgICBnYSgnc2V0JywgJ2Fub255bWl6ZUlwJywgdHJ1ZSk7XHJcbiAgICAgICAgZm9yIChjb25zdCBhY2NvdW50TmFtZSBvZiB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYS5hZGRpdGlvbmFsQWNjb3VudE5hbWVzKSB7XHJcbiAgICAgICAgICBnYShhY2NvdW50TmFtZSArICcuc2V0JywgJ2Fub255bWl6ZUlwJywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGdhKCdzZW5kJywgJ3BhZ2V2aWV3JywgcGF0aCk7XHJcbiAgICAgIGZvciAoY29uc3QgYWNjb3VudE5hbWUgb2YgdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ2EuYWRkaXRpb25hbEFjY291bnROYW1lcykge1xyXG4gICAgICAgIGdhKGFjY291bnROYW1lICsgJy5zZW5kJywgJ3BhZ2V2aWV3JywgcGF0aCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNrIEV2ZW50IGluIEdBXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWN0aW9uIEFzc29jaWF0ZWQgd2l0aCB0aGUgZXZlbnRcclxuICAgKiBAcGFyYW0gcHJvcGVydGllcyBDb21wcmlzZWQgb2Y6XHJcbiAgICogIC0gY2F0ZWdvcnkgKHN0cmluZykgYW5kIG9wdGlvbmFsXHJcbiAgICogIC0gbGFiZWwgKHN0cmluZylcclxuICAgKiAgLSB2YWx1ZSAoaW50ZWdlcilcclxuICAgKiAgLSBub25pbnRlcmFjdGlvbiAoYm9vbGVhbilcclxuICAgKlxyXG4gICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9nYWpzL2V2ZW50VHJhY2tlckd1aWRlI1NldHRpbmdVcEV2ZW50VHJhY2tpbmdcclxuICAgKiBAbGluayBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9hbmFseXRpY3MvZGV2Z3VpZGVzL2NvbGxlY3Rpb24vYW5hbHl0aWNzanMvZXZlbnRzXHJcbiAgICovXHJcbiAgZXZlbnRUcmFjayhhY3Rpb246IHN0cmluZywgcHJvcGVydGllczogYW55KSB7XHJcbiAgICAvLyBHb29nbGUgQW5hbHl0aWNzIHJlcXVpcmVzIGFuIEV2ZW50IENhdGVnb3J5XHJcbiAgICBpZiAoIXByb3BlcnRpZXMgfHwgIXByb3BlcnRpZXMuY2F0ZWdvcnkpIHtcclxuICAgICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwge307XHJcbiAgICAgIHByb3BlcnRpZXMuY2F0ZWdvcnkgPSAnRXZlbnQnO1xyXG4gICAgfVxyXG4gICAgLy8gR0EgcmVxdWlyZXMgdGhhdCBldmVudFZhbHVlIGJlIGFuIGludGVnZXIsIHNlZTpcclxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9hbmFseXRpY3Nqcy9maWVsZC1yZWZlcmVuY2UjZXZlbnRWYWx1ZVxyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2x1aXNmYXJ6YXRpL2FuZ3VsYXJ0aWNzL2lzc3Vlcy84MVxyXG4gICAgaWYgKHByb3BlcnRpZXMudmFsdWUpIHtcclxuICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VJbnQocHJvcGVydGllcy52YWx1ZSwgMTApO1xyXG4gICAgICBwcm9wZXJ0aWVzLnZhbHVlID0gaXNOYU4ocGFyc2VkKSA/IDAgOiBwYXJzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiBnYSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgY29uc3QgZXZlbnRPcHRpb25zID0ge1xyXG4gICAgICAgIGV2ZW50Q2F0ZWdvcnk6IHByb3BlcnRpZXMuY2F0ZWdvcnksXHJcbiAgICAgICAgZXZlbnRBY3Rpb246IGFjdGlvbixcclxuICAgICAgICBldmVudExhYmVsOiBwcm9wZXJ0aWVzLmxhYmVsLFxyXG4gICAgICAgIGV2ZW50VmFsdWU6IHByb3BlcnRpZXMudmFsdWUsXHJcbiAgICAgICAgbm9uSW50ZXJhY3Rpb246IHByb3BlcnRpZXMubm9uaW50ZXJhY3Rpb24sXHJcbiAgICAgICAgcGFnZTogcHJvcGVydGllcy5wYWdlIHx8IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpIHx8IGxvY2F0aW9uLnBhdGhuYW1lLFxyXG4gICAgICAgIHVzZXJJZDogdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ2EudXNlcklkLFxyXG4gICAgICAgIGhpdENhbGxiYWNrOiBwcm9wZXJ0aWVzLmhpdENhbGxiYWNrLFxyXG4gICAgICAgIC4uLih0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYS50cmFuc3BvcnQgJiYge1xyXG4gICAgICAgICAgdHJhbnNwb3J0OiB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYS50cmFuc3BvcnQsXHJcbiAgICAgICAgfSksXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBhZGQgY3VzdG9tIGRpbWVuc2lvbnMgYW5kIG1ldHJpY3NcclxuICAgICAgdGhpcy5zZXREaW1lbnNpb25zQW5kTWV0cmljcyhwcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgIGdhKCdzZW5kJywgJ2V2ZW50JywgZXZlbnRPcHRpb25zKTtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgYWNjb3VudE5hbWUgb2YgdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ2EuYWRkaXRpb25hbEFjY291bnROYW1lcykge1xyXG4gICAgICAgIGdhKGFjY291bnROYW1lICsgJy5zZW5kJywgJ2V2ZW50JywgZXZlbnRPcHRpb25zKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgX2dhcSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgX2dhcS5wdXNoKFtcclxuICAgICAgICAnX3RyYWNrRXZlbnQnLFxyXG4gICAgICAgIHByb3BlcnRpZXMuY2F0ZWdvcnksXHJcbiAgICAgICAgYWN0aW9uLFxyXG4gICAgICAgIHByb3BlcnRpZXMubGFiZWwsXHJcbiAgICAgICAgcHJvcGVydGllcy52YWx1ZSxcclxuICAgICAgICBwcm9wZXJ0aWVzLm5vbmludGVyYWN0aW9uLFxyXG4gICAgICBdKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4Y2VwdGlvbiBUcmFjayBFdmVudCBpbiBHQVxyXG4gICAqXHJcbiAgICogQHBhcmFtIHByb3BlcnRpZXMgQ29tcHJpc2VkIG9mIHRoZSBvcHRpb25hbCBmaWVsZHM6XHJcbiAgICogIC0gZmF0YWwgKHN0cmluZylcclxuICAgKiAgLSBkZXNjcmlwdGlvbiAoc3RyaW5nKVxyXG4gICAqXHJcbiAgICogQGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9hbmFseXRpY3Nqcy9leGNlcHRpb25zXHJcbiAgICpcclxuICAgKiBAbGluayBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9hbmFseXRpY3MvZGV2Z3VpZGVzL2NvbGxlY3Rpb24vYW5hbHl0aWNzanMvZXZlbnRzXHJcbiAgICovXHJcbiAgZXhjZXB0aW9uVHJhY2socHJvcGVydGllczogYW55KSB7XHJcbiAgICBpZiAocHJvcGVydGllcy5mYXRhbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdObyBcImZhdGFsXCIgcHJvdmlkZWQsIHNlbmRpbmcgd2l0aCBmYXRhbD10cnVlJyk7XHJcbiAgICAgIHByb3BlcnRpZXMuZmF0YWwgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3BlcnRpZXMuZXhEZXNjcmlwdGlvbiA9IHByb3BlcnRpZXMuZGVzY3JpcHRpb247XHJcblxyXG4gICAgY29uc3QgZXZlbnRPcHRpb25zID0ge1xyXG4gICAgICBleEZhdGFsOiBwcm9wZXJ0aWVzLmZhdGFsLFxyXG4gICAgICBleERlc2NyaXB0aW9uOiBwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uLFxyXG4gICAgfTtcclxuXHJcbiAgICBnYSgnc2VuZCcsICdleGNlcHRpb24nLCBldmVudE9wdGlvbnMpO1xyXG4gICAgZm9yIChjb25zdCBhY2NvdW50TmFtZSBvZiB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYS5hZGRpdGlvbmFsQWNjb3VudE5hbWVzKSB7XHJcbiAgICAgIGdhKGFjY291bnROYW1lICsgJy5zZW5kJywgJ2V4Y2VwdGlvbicsIGV2ZW50T3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVc2VyIFRpbWluZ3MgRXZlbnQgaW4gR0FcclxuICAgKlxyXG4gICAqIEBwYXJhbSBwcm9wZXJ0aWVzIENvbXByaXNlZCBvZiB0aGUgbWFuZGF0b3J5IGZpZWxkczpcclxuICAgKiAgLSB0aW1pbmdDYXRlZ29yeSAoc3RyaW5nKVxyXG4gICAqICAtIHRpbWluZ1ZhciAoc3RyaW5nKVxyXG4gICAqICAtIHRpbWluZ1ZhbHVlIChudW1iZXIpXHJcbiAgICogUHJvcGVydGllcyBjYW4gYWxzbyBoYXZlIHRoZSBvcHRpb25hbCBmaWVsZHM6XHJcbiAgICogIC0gdGltaW5nTGFiZWwgKHN0cmluZylcclxuICAgKlxyXG4gICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9hbmFseXRpY3Nqcy91c2VyLXRpbWluZ3NcclxuICAgKi9cclxuICB1c2VyVGltaW5ncyhwcm9wZXJ0aWVzOiBVc2VyVGltaW5ncykge1xyXG4gICAgaWYgKFxyXG4gICAgICAhcHJvcGVydGllcyB8fFxyXG4gICAgICAhcHJvcGVydGllcy50aW1pbmdDYXRlZ29yeSB8fFxyXG4gICAgICAhcHJvcGVydGllcy50aW1pbmdWYXIgfHxcclxuICAgICAgIXByb3BlcnRpZXMudGltaW5nVmFsdWVcclxuICAgICkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgICdQcm9wZXJ0aWVzIHRpbWluZ0NhdGVnb3J5LCB0aW1pbmdWYXIsIGFuZCB0aW1pbmdWYWx1ZSBhcmUgcmVxdWlyZWQgdG8gYmUgc2V0LicsXHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGdhICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBnYSgnc2VuZCcsICd0aW1pbmcnLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgZm9yIChjb25zdCBhY2NvdW50TmFtZSBvZiB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYS5hZGRpdGlvbmFsQWNjb3VudE5hbWVzKSB7XHJcbiAgICAgICAgZ2EoYWNjb3VudE5hbWUgKyAnLnNlbmQnLCAndGltaW5nJywgcHJvcGVydGllcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldFVzZXJuYW1lKHVzZXJJZDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nYS51c2VySWQgPSB1c2VySWQ7XHJcbiAgICBpZiAodHlwZW9mIGdhID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBnYSgnc2V0JywgJ3VzZXJJZCcsIHVzZXJJZCk7XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpIHtcclxuICAgIHRoaXMuc2V0RGltZW5zaW9uc0FuZE1ldHJpY3MocHJvcGVydGllcyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldERpbWVuc2lvbnNBbmRNZXRyaWNzKHByb3BlcnRpZXM6IGFueSkge1xyXG4gICAgaWYgKHR5cGVvZiBnYSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8gY2xlYW4gcHJldmlvdXNseSB1c2VkIGRpbWVuc2lvbnMgYW5kIG1ldHJpY3MgdGhhdCB3aWxsIG5vdCBiZSBvdmVycmlkZW5cclxuICAgIHRoaXMuZGltZW5zaW9uc0FuZE1ldHJpY3MuZm9yRWFjaChlbGVtID0+IHtcclxuICAgICAgaWYgKCFwcm9wZXJ0aWVzLmhhc093blByb3BlcnR5KGVsZW0pKSB7XHJcbiAgICAgICAgZ2EoJ3NldCcsIGVsZW0sIHVuZGVmaW5lZCk7XHJcblxyXG4gICAgICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdhLmFkZGl0aW9uYWxBY2NvdW50TmFtZXMuZm9yRWFjaCgoYWNjb3VudE5hbWU6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgZ2EoYCR7YWNjb3VudE5hbWV9LnNldGAsIGVsZW0sIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgdGhpcy5kaW1lbnNpb25zQW5kTWV0cmljcyA9IFtdO1xyXG5cclxuICAgIC8vIGFkZCBjdXN0b20gZGltZW5zaW9ucyBhbmQgbWV0cmljc1xyXG4gICAgT2JqZWN0LmtleXMocHJvcGVydGllcykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICBpZiAoa2V5Lmxhc3RJbmRleE9mKCdkaW1lbnNpb24nLCAwKSA9PT0gMCB8fCBrZXkubGFzdEluZGV4T2YoJ21ldHJpYycsIDApID09PSAwKSB7XHJcbiAgICAgICAgZ2EoJ3NldCcsIGtleSwgcHJvcGVydGllc1trZXldKTtcclxuXHJcbiAgICAgICAgdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ2EuYWRkaXRpb25hbEFjY291bnROYW1lcy5mb3JFYWNoKChhY2NvdW50TmFtZTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICBnYShgJHthY2NvdW50TmFtZX0uc2V0YCwga2V5LCBwcm9wZXJ0aWVzW2tleV0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGltZW5zaW9uc0FuZE1ldHJpY3MucHVzaChrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19