import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
export class Angulartics2Kissmetrics {
    angulartics2;
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
        if (typeof _kmq === 'undefined') {
            _kmq = [];
        }
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
    }
    pageTrack(path) {
        _kmq.push(['record', 'Pageview', { Page: path }]);
    }
    eventTrack(action, properties) {
        _kmq.push(['record', action, properties]);
    }
    setUsername(userId) {
        _kmq.push(['identify', userId]);
    }
    setUserProperties(properties) {
        _kmq.push(['set', properties]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Kissmetrics, deps: [{ token: i1.Angulartics2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Kissmetrics, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Kissmetrics, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lzc21ldHJpY3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3Byb3ZpZGVycy9raXNzbWV0cmljcy9raXNzbWV0cmljcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFPM0MsTUFBTSxPQUFPLHVCQUF1QjtJQUNkO0lBQXBCLFlBQW9CLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzVDLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQy9CLElBQUksR0FBRyxFQUFFLENBQUM7U0FDWDtRQUNELElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7YUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVTthQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQzdDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsU0FBUyxDQUFDLElBQVk7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxVQUFVLENBQUMsTUFBYyxFQUFFLFVBQWU7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQWM7UUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxVQUFlO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDO3dHQWhDVSx1QkFBdUI7NEdBQXZCLHVCQUF1QixjQURWLE1BQU07OzRGQUNuQix1QkFBdUI7a0JBRG5DLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQW5ndWxhcnRpY3MyIH0gZnJvbSAnLi4vLi4vYW5ndWxhcnRpY3MyLWNvcmUnO1xyXG5cclxuZGVjbGFyZSB2YXIgX2ttcTogYW55O1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJ0aWNzMktpc3NtZXRyaWNzIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFuZ3VsYXJ0aWNzMjogQW5ndWxhcnRpY3MyKSB7XHJcbiAgICBpZiAodHlwZW9mIF9rbXEgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIF9rbXEgPSBbXTtcclxuICAgIH1cclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldFVzZXJuYW1lLnN1YnNjcmliZSgoeDogc3RyaW5nKSA9PiB0aGlzLnNldFVzZXJuYW1lKHgpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnNldFVzZXJQcm9wZXJ0aWVzLnN1YnNjcmliZSh4ID0+IHRoaXMuc2V0VXNlclByb3BlcnRpZXMoeCkpO1xyXG4gIH1cclxuXHJcbiAgc3RhcnRUcmFja2luZygpOiB2b2lkIHtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLnBhZ2VUcmFja1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiB0aGlzLnBhZ2VUcmFjayh4LnBhdGgpKTtcclxuICAgIHRoaXMuYW5ndWxhcnRpY3MyLmV2ZW50VHJhY2tcclxuICAgICAgLnBpcGUodGhpcy5hbmd1bGFydGljczIuZmlsdGVyRGV2ZWxvcGVyTW9kZSgpKVxyXG4gICAgICAuc3Vic2NyaWJlKHggPT4gdGhpcy5ldmVudFRyYWNrKHguYWN0aW9uLCB4LnByb3BlcnRpZXMpKTtcclxuICB9XHJcblxyXG4gIHBhZ2VUcmFjayhwYXRoOiBzdHJpbmcpIHtcclxuICAgIF9rbXEucHVzaChbJ3JlY29yZCcsICdQYWdldmlldycsIHsgUGFnZTogcGF0aCB9XSk7XHJcbiAgfVxyXG5cclxuICBldmVudFRyYWNrKGFjdGlvbjogc3RyaW5nLCBwcm9wZXJ0aWVzOiBhbnkpIHtcclxuICAgIF9rbXEucHVzaChbJ3JlY29yZCcsIGFjdGlvbiwgcHJvcGVydGllc10pO1xyXG4gIH1cclxuXHJcbiAgc2V0VXNlcm5hbWUodXNlcklkOiBzdHJpbmcpIHtcclxuICAgIF9rbXEucHVzaChbJ2lkZW50aWZ5JywgdXNlcklkXSk7XHJcbiAgfVxyXG5cclxuICBzZXRVc2VyUHJvcGVydGllcyhwcm9wZXJ0aWVzOiBhbnkpIHtcclxuICAgIF9rbXEucHVzaChbJ3NldCcsIHByb3BlcnRpZXNdKTtcclxuICB9XHJcbn1cclxuIl19