import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
export class Angulartics2LaunchByAdobe {
    angulartics2;
    payload = {};
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
        if ('undefined' === typeof _satellite) {
            console.warn('Launch not found!');
        }
        this.angulartics2.setUsername.subscribe((x) => this.setUsername(x));
        this.angulartics2.setUserProperties.subscribe(x => this.setUserProperties(x));
    }
    setUsername(userId) {
        if ('undefined' !== typeof userId && userId) {
            this.payload.userId = userId;
        }
    }
    setUserProperties(properties) {
        if ('undefined' !== typeof properties && properties) {
            this.payload.properties = properties;
        }
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
        this.payload = this.payload || {};
        this.payload.path = path;
        if ('undefined' !== typeof _satellite && _satellite) {
            _satellite.track('pageTrack', this.payload);
        }
    }
    /**
     * @param action associated with the event
     * @param properties associated with the event
     */
    eventTrack(action, properties) {
        properties = properties || {};
        // add properties to payload
        this.payload.action = action;
        this.payload.eventProperties = properties;
        if ('undefined' !== typeof _satellite && _satellite) {
            _satellite.track('eventTrack', this.payload);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2LaunchByAdobe, deps: [{ token: i1.Angulartics2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2LaunchByAdobe, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2LaunchByAdobe, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF1bmNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm92aWRlcnMvbGF1bmNoL2xhdW5jaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFPM0MsTUFBTSxPQUFPLHlCQUF5QjtJQUdkO0lBRnRCLE9BQU8sR0FBUSxFQUFFLENBQUM7SUFFbEIsWUFBc0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDOUMsSUFBSSxXQUFXLEtBQUssT0FBTyxVQUFVLEVBQUU7WUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQ25DO1FBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQXdCO1FBQ2xDLElBQUksV0FBVyxLQUFLLE9BQU8sTUFBTSxJQUFJLE1BQU0sRUFBRTtZQUMzQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRUQsaUJBQWlCLENBQUMsVUFBZTtRQUMvQixJQUFJLFdBQVcsS0FBSyxPQUFPLFVBQVUsSUFBSSxVQUFVLEVBQUU7WUFDbkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7YUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVTthQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQzdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsU0FBUyxDQUFDLElBQVk7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFFekIsSUFBSSxXQUFXLEtBQUssT0FBTyxVQUFVLElBQUksVUFBVSxFQUFFO1lBQ25ELFVBQVUsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxVQUFVLENBQUMsTUFBYyxFQUFFLFVBQWU7UUFDeEMsVUFBVSxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFFOUIsNEJBQTRCO1FBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsR0FBRyxVQUFVLENBQUM7UUFFMUMsSUFBSSxXQUFXLEtBQUssT0FBTyxVQUFVLElBQUksVUFBVSxFQUFFO1lBQ25ELFVBQVUsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUM5QztJQUNILENBQUM7d0dBdkRVLHlCQUF5Qjs0R0FBekIseUJBQXlCLGNBRFosTUFBTTs7NEZBQ25CLHlCQUF5QjtrQkFEckMsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBBbmd1bGFydGljczIgfSBmcm9tICcuLi8uLi9hbmd1bGFydGljczItY29yZSc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IF9zYXRlbGxpdGU6IGFueTtcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFydGljczJMYXVuY2hCeUFkb2JlIHtcclxuICBwYXlsb2FkOiBhbnkgPSB7fTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGFuZ3VsYXJ0aWNzMjogQW5ndWxhcnRpY3MyKSB7XHJcbiAgICBpZiAoJ3VuZGVmaW5lZCcgPT09IHR5cGVvZiBfc2F0ZWxsaXRlKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignTGF1bmNoIG5vdCBmb3VuZCEnKTtcclxuICAgIH1cclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldFVzZXJuYW1lLnN1YnNjcmliZSgoeDogc3RyaW5nKSA9PiB0aGlzLnNldFVzZXJuYW1lKHgpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldFVzZXJQcm9wZXJ0aWVzLnN1YnNjcmliZSh4ID0+IHRoaXMuc2V0VXNlclByb3BlcnRpZXMoeCkpO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcm5hbWUodXNlcklkOiBzdHJpbmcgfCBib29sZWFuKSB7XHJcbiAgICBpZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiB1c2VySWQgJiYgdXNlcklkKSB7XHJcbiAgICAgIHRoaXMucGF5bG9hZC51c2VySWQgPSB1c2VySWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpIHtcclxuICAgIGlmICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIHByb3BlcnRpZXMgJiYgcHJvcGVydGllcykge1xyXG4gICAgICB0aGlzLnBheWxvYWQucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzdGFydFRyYWNraW5nKCkge1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIucGFnZVRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSh4ID0+IHRoaXMucGFnZVRyYWNrKHgucGF0aCkpO1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIuZXZlbnRUcmFja1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiB0aGlzLmV2ZW50VHJhY2soeC5hY3Rpb24sIHgucHJvcGVydGllcykpO1xyXG4gIH1cclxuXHJcbiAgcGFnZVRyYWNrKHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5wYXlsb2FkID0gdGhpcy5wYXlsb2FkIHx8IHt9O1xyXG4gICAgdGhpcy5wYXlsb2FkLnBhdGggPSBwYXRoO1xyXG5cclxuICAgIGlmICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIF9zYXRlbGxpdGUgJiYgX3NhdGVsbGl0ZSkge1xyXG4gICAgICBfc2F0ZWxsaXRlLnRyYWNrKCdwYWdlVHJhY2snLCB0aGlzLnBheWxvYWQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHBhcmFtIGFjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGV2ZW50XHJcbiAgICogQHBhcmFtIHByb3BlcnRpZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBldmVudFxyXG4gICAqL1xyXG4gIGV2ZW50VHJhY2soYWN0aW9uOiBzdHJpbmcsIHByb3BlcnRpZXM6IGFueSkge1xyXG4gICAgcHJvcGVydGllcyA9IHByb3BlcnRpZXMgfHwge307XHJcblxyXG4gICAgLy8gYWRkIHByb3BlcnRpZXMgdG8gcGF5bG9hZFxyXG4gICAgdGhpcy5wYXlsb2FkLmFjdGlvbiA9IGFjdGlvbjtcclxuICAgIHRoaXMucGF5bG9hZC5ldmVudFByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xyXG5cclxuICAgIGlmICgndW5kZWZpbmVkJyAhPT0gdHlwZW9mIF9zYXRlbGxpdGUgJiYgX3NhdGVsbGl0ZSkge1xyXG4gICAgICBfc2F0ZWxsaXRlLnRyYWNrKCdldmVudFRyYWNrJywgdGhpcy5wYXlsb2FkKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl19