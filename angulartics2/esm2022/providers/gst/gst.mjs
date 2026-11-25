import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
export class GoogleGlobalSiteTagDefaults {
    trackingIds = [];
    constructor() {
        if (typeof ga !== 'undefined' && ga) {
            // See: https://developers.google.com/analytics/devguides/collection/analyticsjs/ga-object-methods-reference
            ga(() => {
                ga.getAll().forEach((tracker) => {
                    const id = tracker.get('trackingId');
                    // If set both in forRoot and HTML page, we want to avoid duplicates
                    if (id !== undefined && this.trackingIds.indexOf(id) === -1) {
                        this.trackingIds.push(id);
                    }
                });
            });
        }
    }
}
export class Angulartics2GoogleGlobalSiteTag {
    angulartics2;
    dimensionsAndMetrics = {};
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
        const defaults = new GoogleGlobalSiteTagDefaults();
        // Set the default settings for this module
        this.angulartics2.settings.gst = { ...defaults, ...this.angulartics2.settings.gst };
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
            .subscribe((x) => this.exceptionTrack(x));
        this.angulartics2.userTimings
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.userTimings(this.convertTimings(x)));
        this.angulartics2.setUsername
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.setUsername(x));
        this.angulartics2.setUserProperties
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.setUserProperties(x));
    }
    /**
     * Manually track page view, see:
     *
     * https://developers.google.com/analytics/devguides/collection/gtagjs/single-page-applications#tracking_virtual_pageviews
     *
     * @param path relative url
     */
    pageTrack(path) {
        if (typeof gtag !== 'undefined' && gtag) {
            const params = {
                page_path: path,
                page_location: window.location.protocol + '//' + window.location.host + path,
                ...this.dimensionsAndMetrics,
            };
            // Custom map must be reset with all config to stay valid.
            if (this.angulartics2.settings.gst.customMap) {
                params.custom_map = this.angulartics2.settings.gst.customMap;
            }
            if (this.angulartics2.settings.gst.userId) {
                params.user_id = this.angulartics2.settings.gst.userId;
            }
            if (this.angulartics2.settings.gst.anonymizeIp) {
                params.anonymize_ip = this.angulartics2.settings.gst.anonymizeIp;
            }
            for (const id of this.angulartics2.settings.gst.trackingIds) {
                gtag('config', id, params);
            }
        }
    }
    /**
     * Send interactions to gtag, i.e. for event tracking in Google Analytics. See:
     *
     * https://developers.google.com/analytics/devguides/collection/gtagjs/events
     *
     * @param action associated with the event
     */
    eventTrack(action, properties = {}) {
        this.eventTrackInternal(action, {
            event_category: properties.category || 'interaction',
            event_label: properties.label,
            value: properties.value,
            non_interaction: properties.noninteraction,
            ...properties.gstCustom,
        });
    }
    /**
     * Exception Track Event in GST. See:
     *
     * https://developers.google.com/analytics/devguides/collection/gtagjs/exceptions
     *
     */
    exceptionTrack(properties) {
        // TODO: make interface
        //  @param {Object} properties
        //  @param {string} [properties.description]
        //  @param {boolean} [properties.fatal]
        if (properties.fatal === undefined) {
            console.log('No "fatal" provided, sending with fatal=true');
            properties.fatal = true;
        }
        properties.exDescription = properties.event ? properties.event.stack : properties.description;
        this.eventTrack('exception', {
            gstCustom: {
                description: properties.exDescription,
                fatal: properties.fatal,
                ...properties.gstCustom,
            },
        });
    }
    /**
     * User Timings Event in GST.
     *
     * @param properties Comprised of the mandatory fields:
     *  - name (string)
     *  - value (number - integer)
     * Properties can also have the optional fields:
     *  - category (string)
     *  - label (string)
     *
     * @link https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings
     */
    userTimings(properties) {
        if (!properties) {
            console.error('User timings - "properties" parameter is required to be set.');
            return;
        }
        this.eventTrackInternal('timing_complete', {
            name: properties.name,
            value: properties.value,
            event_category: properties.category,
            event_label: properties.label,
        });
    }
    convertTimings(properties) {
        return {
            name: properties.timingVar,
            value: properties.timingValue,
            category: properties.timingCategory,
            label: properties.timingLabel,
        };
    }
    setUsername(userId) {
        this.angulartics2.settings.gst.userId = userId;
        if (typeof gtag !== 'undefined' && gtag) {
            gtag('set', { user_id: typeof userId === 'string' || !userId ? userId : userId.userId });
        }
    }
    setUserProperties(properties) {
        this.setDimensionsAndMetrics(properties);
    }
    setDimensionsAndMetrics(properties) {
        // We want the dimensions and metrics to accumulate, so we merge with previous value
        this.dimensionsAndMetrics = {
            ...this.dimensionsAndMetrics,
            ...properties,
        };
        // Remove properties that are null or undefined
        Object.keys(this.dimensionsAndMetrics).forEach(key => {
            const val = this.dimensionsAndMetrics[key];
            if (val === undefined || val === null) {
                delete this.dimensionsAndMetrics[key];
            }
        });
        if (typeof gtag !== 'undefined' && gtag) {
            gtag('set', this.dimensionsAndMetrics);
        }
    }
    eventTrackInternal(action, properties = {}) {
        this.cleanProperties(properties);
        if (typeof gtag !== 'undefined' && gtag) {
            gtag('event', action, properties);
        }
    }
    cleanProperties(properties) {
        // GA requires that eventValue be an non-negative integer, see:
        // https://developers.google.com/analytics/devguides/collection/gtagjs/events
        if (properties.value) {
            const parsed = parseInt(properties.value, 10);
            properties.value = isNaN(parsed) ? 0 : parsed;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleGlobalSiteTag, deps: [{ token: i1.Angulartics2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleGlobalSiteTag, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleGlobalSiteTag, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3N0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm92aWRlcnMvZ3N0L2dzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFVM0MsTUFBTSxPQUFPLDJCQUEyQjtJQUN0QyxXQUFXLEdBQWEsRUFBRSxDQUFDO0lBRTNCO1FBQ0UsSUFBSSxPQUFPLEVBQUUsS0FBSyxXQUFXLElBQUksRUFBRSxFQUFFO1lBQ25DLDRHQUE0RztZQUM1RyxFQUFFLENBQUMsR0FBRyxFQUFFO2dCQUNOLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRTtvQkFDbkMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDckMsb0VBQW9FO29CQUNwRSxJQUFJLEVBQUUsS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7d0JBQzNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUMzQjtnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0NBQ0Y7QUFHRCxNQUFNLE9BQU8sK0JBQStCO0lBR3BCO0lBRmQsb0JBQW9CLEdBQTJCLEVBQUUsQ0FBQztJQUUxRCxZQUFzQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUM5QyxNQUFNLFFBQVEsR0FBRyxJQUFJLDJCQUEyQixFQUFFLENBQUM7UUFDbkQsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFR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Q0FBQztTQUMvQztJQUNILENBQUM7d0dBM0xVLCtCQUErQjs0R0FBL0IsK0JBQStCLGNBRGxCLE1BQU07OzRGQUNuQiwrQkFBK0I7a0JBRDNDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgVXNlclRpbWluZ3MgfSBmcm9tICcuLi8uLi9hbmd1bGFydGljczItaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IEdvb2dsZUdsb2JhbFNpdGVUYWdTZXR0aW5ncyB9IGZyb20gJy4uLy4uL2FuZ3VsYXJ0aWNzMi1jb25maWcnO1xyXG5pbXBvcnQgeyBBbmd1bGFydGljczIgfSBmcm9tICcuLi8uLi9hbmd1bGFydGljczItY29yZSc7XHJcbmltcG9ydCB7IEV2ZW50R3N0LCBVc2VyVGltaW5nc0dzdCB9IGZyb20gJy4vZ3N0LWludGVyZmFjZXMnO1xyXG5cclxuZGVjbGFyZSB2YXIgZ3RhZzogYW55O1xyXG5kZWNsYXJlIHZhciBnYTogYW55O1xyXG5cclxuZXhwb3J0IGNsYXNzIEdvb2dsZUdsb2JhbFNpdGVUYWdEZWZhdWx0cyBpbXBsZW1lbnRzIEdvb2dsZUdsb2JhbFNpdGVUYWdTZXR0aW5ncyB7XHJcbiAgdHJhY2tpbmdJZHM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgaWYgKHR5cGVvZiBnYSAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2EpIHtcclxuICAgICAgLy8gU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9hbmFseXRpY3MvZGV2Z3VpZGVzL2NvbGxlY3Rpb24vYW5hbHl0aWNzanMvZ2Etb2JqZWN0LW1ldGhvZHMtcmVmZXJlbmNlXHJcbiAgICAgIGdhKCgpID0+IHtcclxuICAgICAgICBnYS5nZXRBbGwoKS5mb3JFYWNoKCh0cmFja2VyOiBhbnkpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGlkID0gdHJhY2tlci5nZXQoJ3RyYWNraW5nSWQnKTtcclxuICAgICAgICAgIC8vIElmIHNldCBib3RoIGluIGZvclJvb3QgYW5kIEhUTUwgcGFnZSwgd2Ugd2FudCB0byBhdm9pZCBkdXBsaWNhdGVzXHJcbiAgICAgICAgICBpZiAoaWQgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnRyYWNraW5nSWRzLmluZGV4T2YoaWQpID09PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnRyYWNraW5nSWRzLnB1c2goaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFydGljczJHb29nbGVHbG9iYWxTaXRlVGFnIHtcclxuICBwcml2YXRlIGRpbWVuc2lvbnNBbmRNZXRyaWNzOiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhbmd1bGFydGljczI6IEFuZ3VsYXJ0aWNzMikge1xyXG4gICAgY29uc3QgZGVmYXVsdHMgPSBuZXcgR29vZ2xlR2xvYmFsU2l0ZVRhZ0RlZmF1bHRzKCk7XHJcbiAgICAvLyBTZXQgdGhlIGRlZmF1bHQgc2V0dGluZ3MgZm9yIHRoaXMgbW9kdWxlXHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nc3QgPSB7IC4uLmRlZmF1bHRzLCAuLi50aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nc3QgfTtcclxuICB9XHJcblxyXG4gIHN0YXJ0VHJhY2tpbmcoKTogdm9pZCB7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5wYWdlVHJhY2tcclxuICAgICAgLnBpcGUodGhpcy5hbmd1bGFydGljczIuZmlsdGVyRGV2ZWxvcGVyTW9kZSgpKVxyXG4gICAgICAuc3Vic2NyaWJlKHggPT4gdGhpcy5wYWdlVHJhY2soeC5wYXRoKSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5ldmVudFRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSh4ID0+IHRoaXMuZXZlbnRUcmFjayh4LmFjdGlvbiwgeC5wcm9wZXJ0aWVzKSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5leGNlcHRpb25UcmFja1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHg6IGFueSkgPT4gdGhpcy5leGNlcHRpb25UcmFjayh4KSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi51c2VyVGltaW5nc1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiB0aGlzLnVzZXJUaW1pbmdzKHRoaXMuY29udmVydFRpbWluZ3MoeCkpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldFVzZXJuYW1lXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSgoeDogc3RyaW5nKSA9PiB0aGlzLnNldFVzZXJuYW1lKHgpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldFVzZXJQcm9wZXJ0aWVzXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSgoeDogYW55KSA9PiB0aGlzLnNldFVzZXJQcm9wZXJ0aWVzKHgpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hbnVhbGx5IHRyYWNrIHBhZ2Ugdmlldywgc2VlOlxyXG4gICAqXHJcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vYW5hbHl0aWNzL2Rldmd1aWRlcy9jb2xsZWN0aW9uL2d0YWdqcy9zaW5nbGUtcGFnZS1hcHBsaWNhdGlvbnMjdHJhY2tpbmdfdmlydHVhbF9wYWdldmlld3NcclxuICAgKlxyXG4gICAqIEBwYXJhbSBwYXRoIHJlbGF0aXZlIHVybFxyXG4gICAqL1xyXG4gIHBhZ2VUcmFjayhwYXRoOiBzdHJpbmcpIHtcclxuICAgIGlmICh0eXBlb2YgZ3RhZyAhPT0gJ3VuZGVmaW5lZCcgJiYgZ3RhZykge1xyXG4gICAgICBjb25zdCBwYXJhbXM6IGFueSA9IHtcclxuICAgICAgICBwYWdlX3BhdGg6IHBhdGgsXHJcbiAgICAgICAgcGFnZV9sb2NhdGlvbjogd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgcGF0aCxcclxuICAgICAgICAuLi50aGlzLmRpbWVuc2lvbnNBbmRNZXRyaWNzLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gQ3VzdG9tIG1hcCBtdXN0IGJlIHJlc2V0IHdpdGggYWxsIGNvbmZpZyB0byBzdGF5IHZhbGlkLlxyXG5cclxuICAgICAgaWYgKHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdzdC5jdXN0b21NYXApIHtcclxuICAgICAgICBwYXJhbXMuY3VzdG9tX21hcCA9IHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdzdC5jdXN0b21NYXA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdzdC51c2VySWQpIHtcclxuICAgICAgICBwYXJhbXMudXNlcl9pZCA9IHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdzdC51c2VySWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdzdC5hbm9ueW1pemVJcCkge1xyXG4gICAgICAgIHBhcmFtcy5hbm9ueW1pemVfaXAgPSB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5nc3QuYW5vbnltaXplSXA7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAoY29uc3QgaWQgb2YgdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ3N0LnRyYWNraW5nSWRzKSB7XHJcbiAgICAgICAgZ3RhZygnY29uZmlnJywgaWQsIHBhcmFtcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgaW50ZXJhY3Rpb25zIHRvIGd0YWcsIGkuZS4gZm9yIGV2ZW50IHRyYWNraW5nIGluIEdvb2dsZSBBbmFseXRpY3MuIFNlZTpcclxuICAgKlxyXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9ndGFnanMvZXZlbnRzXHJcbiAgICpcclxuICAgKiBAcGFyYW0gYWN0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgZXZlbnRcclxuICAgKi9cclxuICBldmVudFRyYWNrKGFjdGlvbjogc3RyaW5nLCBwcm9wZXJ0aWVzOiBQYXJ0aWFsPEV2ZW50R3N0PiA9IHt9KSB7XHJcbiAgICB0aGlzLmV2ZW50VHJhY2tJbnRlcm5hbChhY3Rpb24sIHtcclxuICAgICAgZXZlbnRfY2F0ZWdvcnk6IHByb3BlcnRpZXMuY2F0ZWdvcnkgfHwgJ2ludGVyYWN0aW9uJyxcclxuICAgICAgZXZlbnRfbGFiZWw6IHByb3BlcnRpZXMubGFiZWwsXHJcbiAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzLnZhbHVlLFxyXG4gICAgICBub25faW50ZXJhY3Rpb246IHByb3BlcnRpZXMubm9uaW50ZXJhY3Rpb24sXHJcbiAgICAgIC4uLnByb3BlcnRpZXMuZ3N0Q3VzdG9tLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBFeGNlcHRpb24gVHJhY2sgRXZlbnQgaW4gR1NULiBTZWU6XHJcbiAgICpcclxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9hbmFseXRpY3MvZGV2Z3VpZGVzL2NvbGxlY3Rpb24vZ3RhZ2pzL2V4Y2VwdGlvbnNcclxuICAgKlxyXG4gICAqL1xyXG4gIGV4Y2VwdGlvblRyYWNrKHByb3BlcnRpZXM6IGFueSkge1xyXG4gICAgLy8gVE9ETzogbWFrZSBpbnRlcmZhY2VcclxuICAgIC8vICBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllc1xyXG4gICAgLy8gIEBwYXJhbSB7c3RyaW5nfSBbcHJvcGVydGllcy5kZXNjcmlwdGlvbl1cclxuICAgIC8vICBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wZXJ0aWVzLmZhdGFsXVxyXG4gICAgaWYgKHByb3BlcnRpZXMuZmF0YWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnTm8gXCJmYXRhbFwiIHByb3ZpZGVkLCBzZW5kaW5nIHdpdGggZmF0YWw9dHJ1ZScpO1xyXG4gICAgICBwcm9wZXJ0aWVzLmZhdGFsID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm9wZXJ0aWVzLmV4RGVzY3JpcHRpb24gPSBwcm9wZXJ0aWVzLmV2ZW50ID8gcHJvcGVydGllcy5ldmVudC5zdGFjayA6IHByb3BlcnRpZXMuZGVzY3JpcHRpb247XHJcblxyXG4gICAgdGhpcy5ldmVudFRyYWNrKCdleGNlcHRpb24nLCB7XHJcbiAgICAgIGdzdEN1c3RvbToge1xyXG4gICAgICAgIGRlc2NyaXB0aW9uOiBwcm9wZXJ0aWVzLmV4RGVzY3JpcHRpb24sXHJcbiAgICAgICAgZmF0YWw6IHByb3BlcnRpZXMuZmF0YWwsXHJcbiAgICAgICAgLi4ucHJvcGVydGllcy5nc3RDdXN0b20sXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVzZXIgVGltaW5ncyBFdmVudCBpbiBHU1QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0gcHJvcGVydGllcyBDb21wcmlzZWQgb2YgdGhlIG1hbmRhdG9yeSBmaWVsZHM6XHJcbiAgICogIC0gbmFtZSAoc3RyaW5nKVxyXG4gICAqICAtIHZhbHVlIChudW1iZXIgLSBpbnRlZ2VyKVxyXG4gICAqIFByb3BlcnRpZXMgY2FuIGFsc28gaGF2ZSB0aGUgb3B0aW9uYWwgZmllbGRzOlxyXG4gICAqICAtIGNhdGVnb3J5IChzdHJpbmcpXHJcbiAgICogIC0gbGFiZWwgKHN0cmluZylcclxuICAgKlxyXG4gICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9ndGFnanMvdXNlci10aW1pbmdzXHJcbiAgICovXHJcbiAgdXNlclRpbWluZ3MocHJvcGVydGllczogVXNlclRpbWluZ3NHc3QpIHtcclxuICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdVc2VyIHRpbWluZ3MgLSBcInByb3BlcnRpZXNcIiBwYXJhbWV0ZXIgaXMgcmVxdWlyZWQgdG8gYmUgc2V0LicpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ldmVudFRyYWNrSW50ZXJuYWwoJ3RpbWluZ19jb21wbGV0ZScsIHtcclxuICAgICAgbmFtZTogcHJvcGVydGllcy5uYW1lLFxyXG4gICAgICB2YWx1ZTogcHJvcGVydGllcy52YWx1ZSxcclxuICAgICAgZXZlbnRfY2F0ZWdvcnk6IHByb3BlcnRpZXMuY2F0ZWdvcnksXHJcbiAgICAgIGV2ZW50X2xhYmVsOiBwcm9wZXJ0aWVzLmxhYmVsLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbnZlcnRUaW1pbmdzKHByb3BlcnRpZXM6IFVzZXJUaW1pbmdzKTogVXNlclRpbWluZ3NHc3Qge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmFtZTogcHJvcGVydGllcy50aW1pbmdWYXIsXHJcbiAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzLnRpbWluZ1ZhbHVlLFxyXG4gICAgICBjYXRlZ29yeTogcHJvcGVydGllcy50aW1pbmdDYXRlZ29yeSxcclxuICAgICAgbGFiZWw6IHByb3BlcnRpZXMudGltaW5nTGFiZWwsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcm5hbWUodXNlcklkOiBzdHJpbmcgfCB7IHVzZXJJZDogc3RyaW5nIHwgbnVtYmVyIH0pIHtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmdzdC51c2VySWQgPSB1c2VySWQ7XHJcbiAgICBpZiAodHlwZW9mIGd0YWcgIT09ICd1bmRlZmluZWQnICYmIGd0YWcpIHtcclxuICAgICAgZ3RhZygnc2V0JywgeyB1c2VyX2lkOiB0eXBlb2YgdXNlcklkID09PSAnc3RyaW5nJyB8fCAhdXNlcklkID8gdXNlcklkIDogdXNlcklkLnVzZXJJZCB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldFVzZXJQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IGFueSkge1xyXG4gICAgdGhpcy5zZXREaW1lbnNpb25zQW5kTWV0cmljcyhwcm9wZXJ0aWVzKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0RGltZW5zaW9uc0FuZE1ldHJpY3MocHJvcGVydGllczogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xyXG4gICAgLy8gV2Ugd2FudCB0aGUgZGltZW5zaW9ucyBhbmQgbWV0cmljcyB0byBhY2N1bXVsYXRlLCBzbyB3ZSBtZXJnZSB3aXRoIHByZXZpb3VzIHZhbHVlXHJcbiAgICB0aGlzLmRpbWVuc2lvbnNBbmRNZXRyaWNzID0ge1xyXG4gICAgICAuLi50aGlzLmRpbWVuc2lvbnNBbmRNZXRyaWNzLFxyXG4gICAgICAuLi5wcm9wZXJ0aWVzLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBSZW1vdmUgcHJvcGVydGllcyB0aGF0IGFyZSBudWxsIG9yIHVuZGVmaW5lZFxyXG4gICAgT2JqZWN0LmtleXModGhpcy5kaW1lbnNpb25zQW5kTWV0cmljcykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICBjb25zdCB2YWwgPSB0aGlzLmRpbWVuc2lvbnNBbmRNZXRyaWNzW2tleV07XHJcbiAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCB8fCB2YWwgPT09IG51bGwpIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5kaW1lbnNpb25zQW5kTWV0cmljc1trZXldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGd0YWcgIT09ICd1bmRlZmluZWQnICYmIGd0YWcpIHtcclxuICAgICAgZ3RhZygnc2V0JywgdGhpcy5kaW1lbnNpb25zQW5kTWV0cmljcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGV2ZW50VHJhY2tJbnRlcm5hbChhY3Rpb246IHN0cmluZywgcHJvcGVydGllczogYW55ID0ge30pIHtcclxuICAgIHRoaXMuY2xlYW5Qcm9wZXJ0aWVzKHByb3BlcnRpZXMpO1xyXG4gICAgaWYgKHR5cGVvZiBndGFnICE9PSAndW5kZWZpbmVkJyAmJiBndGFnKSB7XHJcbiAgICAgIGd0YWcoJ2V2ZW50JywgYWN0aW9uLCBwcm9wZXJ0aWVzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xlYW5Qcm9wZXJ0aWVzKHByb3BlcnRpZXM6IHsgW2tleTogc3RyaW5nXTogYW55IH0pOiB2b2lkIHtcclxuICAgIC8vIEdBIHJlcXVpcmVzIHRoYXQgZXZlbnRWYWx1ZSBiZSBhbiBub24tbmVnYXRpdmUgaW50ZWdlciwgc2VlOlxyXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vYW5hbHl0aWNzL2Rldmd1aWRlcy9jb2xsZWN0aW9uL2d0YWdqcy9ldmVudHNcclxuICAgIGlmIChwcm9wZXJ0aWVzLnZhbHVlKSB7XHJcbiAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHByb3BlcnRpZXMudmFsdWUsIDEwKTtcclxuICAgICAgcHJvcGVydGllcy52YWx1ZSA9IGlzTmFOKHBhcnNlZCkgPyAwIDogcGFyc2VkO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=