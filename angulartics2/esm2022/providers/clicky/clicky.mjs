import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
import * as i2 from "@angular/platform-browser";
export class Angulartics2Clicky {
    angulartics2;
    titleService;
    constructor(angulartics2, titleService) {
        this.angulartics2 = angulartics2;
        this.titleService = titleService;
        if (typeof clicky === 'undefined') {
            console.warn('Angulartics 2 Clicky Plugin: clicky global not found');
        }
    }
    startTracking() {
        this.angulartics2.pageTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.pageTrack(x.path));
        this.angulartics2.eventTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.eventOrGoalTrack(x.action, x.properties));
    }
    /**
     * Track Page in Clicky
     *
     * @param path location
     *
     * @link https://clicky.com/help/custom/manual#log
     */
    pageTrack(path) {
        const title = this.titleService.getTitle();
        clicky.log(path, title, 'pageview');
    }
    /**
     * Track Event Or Goal in Clicky
     *
     * @param action Action name
     * @param properties Definition of 'properties.goal' determines goal vs event tracking
     *
     * @link https://clicky.com/help/custom/manual#log
     * @link https://clicky.com/help/custom/manual#goal
     */
    eventOrGoalTrack(action, properties) {
        if (typeof properties.goal === 'undefined') {
            const title = properties.title || null;
            const type = properties.type != null ? this.validateType(properties.type) : null;
            clicky.log(action, title, type);
        }
        else {
            const goalId = properties.goal;
            const revenue = properties.revenue;
            clicky.goal(goalId, revenue, !!properties.noQueue);
        }
    }
    validateType(type) {
        const EventType = ['pageview', 'click', 'download', 'outbound'];
        return EventType.indexOf(type) > -1 ? type : 'pageview';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Clicky, deps: [{ token: i1.Angulartics2 }, { token: i2.Title }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Clicky, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Clicky, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }, { type: i2.Title }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpY2t5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm92aWRlcnMvY2xpY2t5L2NsaWNreS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBUzNDLE1BQU0sT0FBTyxrQkFBa0I7SUFDVDtJQUFvQztJQUF4RCxZQUFvQixZQUEwQixFQUFVLFlBQW1CO1FBQXZELGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQVUsaUJBQVksR0FBWixZQUFZLENBQU87UUFDekUsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUU7WUFDakMsT0FBTyxDQUFDLElBQUksQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO1NBQ3RFO0lBQ0gsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7YUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVTthQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQzdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxTQUFTLENBQUMsSUFBWTtRQUNwQixNQUFNLEtBQUssR0FBVyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxnQkFBZ0IsQ0FBQyxNQUFjLEVBQUUsVUFBcUM7UUFDcEUsSUFBSSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzFDLE1BQU0sS0FBSyxHQUFXLFVBQVUsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO1lBQy9DLE1BQU0sSUFBSSxHQUFXLFVBQVUsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3pGLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqQzthQUFNO1lBQ0wsTUFBTSxNQUFNLEdBQVcsVUFBVSxDQUFDLElBQUksQ0FBQztZQUN2QyxNQUFNLE9BQU8sR0FBVyxVQUFVLENBQUMsT0FBTyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUVPLFlBQVksQ0FBQyxJQUFZO1FBQy9CLE1BQU0sU0FBUyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEUsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUMxRCxDQUFDO3dHQXBEVSxrQkFBa0I7NEdBQWxCLGtCQUFrQixjQURMLE1BQU07OzRGQUNuQixrQkFBa0I7a0JBRDlCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBUaXRsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xyXG5cclxuaW1wb3J0IHsgQW5ndWxhcnRpY3MyIH0gZnJvbSAnLi4vLi4vYW5ndWxhcnRpY3MyLWNvcmUnO1xyXG5pbXBvcnQgeyBDbGlja3lQcm9wZXJ0aWVzIH0gZnJvbSAnLi9jbGlja3kuaW50ZXJmYWNlcyc7XHJcblxyXG5kZWNsYXJlIHZhciBjbGlja3k6IGFueTtcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFydGljczJDbGlja3kge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYW5ndWxhcnRpY3MyOiBBbmd1bGFydGljczIsIHByaXZhdGUgdGl0bGVTZXJ2aWNlOiBUaXRsZSkge1xyXG4gICAgaWYgKHR5cGVvZiBjbGlja3kgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignQW5ndWxhcnRpY3MgMiBDbGlja3kgUGx1Z2luOiBjbGlja3kgZ2xvYmFsIG5vdCBmb3VuZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhcnRUcmFja2luZygpOiB2b2lkIHtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnBhZ2VUcmFja1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiB0aGlzLnBhZ2VUcmFjayh4LnBhdGgpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLmV2ZW50VHJhY2tcclxuICAgICAgLnBpcGUodGhpcy5hbmd1bGFydGljczIuZmlsdGVyRGV2ZWxvcGVyTW9kZSgpKVxyXG4gICAgICAuc3Vic2NyaWJlKHggPT4gdGhpcy5ldmVudE9yR29hbFRyYWNrKHguYWN0aW9uLCB4LnByb3BlcnRpZXMpKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNrIFBhZ2UgaW4gQ2xpY2t5XHJcbiAgICpcclxuICAgKiBAcGFyYW0gcGF0aCBsb2NhdGlvblxyXG4gICAqXHJcbiAgICogQGxpbmsgaHR0cHM6Ly9jbGlja3kuY29tL2hlbHAvY3VzdG9tL21hbnVhbCNsb2dcclxuICAgKi9cclxuICBwYWdlVHJhY2socGF0aDogc3RyaW5nKSB7XHJcbiAgICBjb25zdCB0aXRsZTogc3RyaW5nID0gdGhpcy50aXRsZVNlcnZpY2UuZ2V0VGl0bGUoKTtcclxuICAgIGNsaWNreS5sb2cocGF0aCwgdGl0bGUsICdwYWdldmlldycpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVHJhY2sgRXZlbnQgT3IgR29hbCBpbiBDbGlja3lcclxuICAgKlxyXG4gICAqIEBwYXJhbSBhY3Rpb24gQWN0aW9uIG5hbWVcclxuICAgKiBAcGFyYW0gcHJvcGVydGllcyBEZWZpbml0aW9uIG9mICdwcm9wZXJ0aWVzLmdvYWwnIGRldGVybWluZXMgZ29hbCB2cyBldmVudCB0cmFja2luZ1xyXG4gICAqXHJcbiAgICogQGxpbmsgaHR0cHM6Ly9jbGlja3kuY29tL2hlbHAvY3VzdG9tL21hbnVhbCNsb2dcclxuICAgKiBAbGluayBodHRwczovL2NsaWNreS5jb20vaGVscC9jdXN0b20vbWFudWFsI2dvYWxcclxuICAgKi9cclxuICBldmVudE9yR29hbFRyYWNrKGFjdGlvbjogc3RyaW5nLCBwcm9wZXJ0aWVzOiBQYXJ0aWFsPENsaWNreVByb3BlcnRpZXM+KSB7XHJcbiAgICBpZiAodHlwZW9mIHByb3BlcnRpZXMuZ29hbCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgY29uc3QgdGl0bGU6IHN0cmluZyA9IHByb3BlcnRpZXMudGl0bGUgfHwgbnVsbDtcclxuICAgICAgY29uc3QgdHlwZTogc3RyaW5nID0gcHJvcGVydGllcy50eXBlICE9IG51bGwgPyB0aGlzLnZhbGlkYXRlVHlwZShwcm9wZXJ0aWVzLnR5cGUpIDogbnVsbDtcclxuICAgICAgY2xpY2t5LmxvZyhhY3Rpb24sIHRpdGxlLCB0eXBlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGdvYWxJZDogc3RyaW5nID0gcHJvcGVydGllcy5nb2FsO1xyXG4gICAgICBjb25zdCByZXZlbnVlOiBudW1iZXIgPSBwcm9wZXJ0aWVzLnJldmVudWU7XHJcbiAgICAgIGNsaWNreS5nb2FsKGdvYWxJZCwgcmV2ZW51ZSwgISFwcm9wZXJ0aWVzLm5vUXVldWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB2YWxpZGF0ZVR5cGUodHlwZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGNvbnN0IEV2ZW50VHlwZSA9IFsncGFnZXZpZXcnLCAnY2xpY2snLCAnZG93bmxvYWQnLCAnb3V0Ym91bmQnXTtcclxuICAgIHJldHVybiBFdmVudFR5cGUuaW5kZXhPZih0eXBlKSA+IC0xID8gdHlwZSA6ICdwYWdldmlldyc7XHJcbiAgfVxyXG59XHJcbiJdfQ==