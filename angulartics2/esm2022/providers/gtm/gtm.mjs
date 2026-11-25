import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
export class GoogleTagManagerDefaults {
    userId = null;
}
export class Angulartics2GoogleTagManager {
    angulartics2;
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
        // The dataLayer needs to be initialized
        if (typeof dataLayer !== 'undefined' && dataLayer) {
            dataLayer = window.dataLayer = window.dataLayer || [];
        }
        const defaults = new GoogleTagManagerDefaults();
        // Set the default settings for this module
        this.angulartics2.settings.gtm = { ...defaults, ...this.angulartics2.settings.gtm };
        this.angulartics2.setUsername.subscribe((x) => this.setUsername(x));
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
    }
    pageTrack(path) {
        this.pushLayer({
            event: 'Page View',
            'content-name': path,
            userId: this.angulartics2.settings.gtm.userId,
        });
    }
    /**
     * Send Data Layer
     *
     * @layer data layer object
     */
    pushLayer(layer) {
        if (typeof dataLayer !== 'undefined' && dataLayer) {
            dataLayer.push(layer);
        }
    }
    /**
     * Send interactions to the dataLayer, i.e. for event tracking in Google Analytics
     *
     * @param action associated with the event
     */
    eventTrack(action, properties) {
        // TODO: make interface
        //  @param {string} properties.category
        //  @param {string} [properties.label]
        //  @param {number} [properties.value]
        //  @param {boolean} [properties.noninteraction]
        // Set a default GTM category
        properties = properties || {};
        this.pushLayer({
            event: properties.event || 'interaction',
            target: properties.category || 'Event',
            action,
            label: properties.label,
            value: properties.value,
            interactionType: properties.noninteraction,
            userId: this.angulartics2.settings.gtm.userId,
            ...properties.gtmCustom,
        });
    }
    /**
     * Exception Track Event in GTM
     *
     */
    exceptionTrack(properties) {
        // TODO: make interface
        //  @param {Object} properties
        //  @param {string} properties.appId
        //  @param {string} properties.appName
        //  @param {string} properties.appVersion
        //  @param {string} [properties.description]
        //  @param {boolean} [properties.fatal]
        if (!properties || !properties.appId || !properties.appName || !properties.appVersion) {
            console.error('Must be setted appId, appName and appVersion.');
            return;
        }
        if (properties.fatal === undefined) {
            console.log('No "fatal" provided, sending with fatal=true');
            properties.exFatal = true;
        }
        properties.exDescription = properties.event ? properties.event.stack : properties.description;
        this.eventTrack(`Exception thrown for ${properties.appName} <${properties.appId}@${properties.appVersion}>`, {
            category: 'Exception',
            label: properties.exDescription,
        });
    }
    /**
     * Set userId for use with Universal Analytics User ID feature
     *
     * @param userId used to identify user cross-device in Google Analytics
     */
    setUsername(userId) {
        this.angulartics2.settings.gtm.userId = userId;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleTagManager, deps: [{ token: i1.Angulartics2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleTagManager, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleTagManager, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3RtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm92aWRlcnMvZ3RtL2d0bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFPM0MsTUFBTSxPQUFPLHdCQUF3QjtJQUNuQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0NBQ2Y7QUFHRCxNQUFNLE9BQU8sNEJBQTRCO0lBQ2pCO0lBQXRCLFlBQXNCLFlBQTBCO1FBQTFCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzlDLHdDQUF3QztRQUN4QyxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUU7WUFDakQsU0FBUyxHQUFJLE1BQWMsQ0FBQyxTQUFTLEdBQUksTUFBYyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7U0FDekU7UUFDRCxNQUFNLFFBQVEsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7UUFDaEQsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDcEYsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELGFBQWE7UUFDWCxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVM7YUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFD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QUFLLEVBQUUsVUFBVSxDQUFDLGFBQWE7U0FDaEMsQ0FDRixDQUFDO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsTUFBYztRQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNqRCxDQUFDO3dHQTdHVSw0QkFBNEI7NEdBQTVCLDRCQUE0QixjQURmLE1BQU07OzRGQUNuQiw0QkFBNEI7a0JBRHhDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQW5ndWxhcnRpY3MyIH0gZnJvbSAnLi4vLi4vYW5ndWxhcnRpY3MyLWNvcmUnO1xyXG5pbXBvcnQgeyBHb29nbGVUYWdNYW5hZ2VyU2V0dGluZ3MgfSBmcm9tICcuLi8uLi9hbmd1bGFydGljczItY29uZmlnJztcclxuXHJcbmRlY2xhcmUgdmFyIGRhdGFMYXllcjogYW55O1xyXG5cclxuZXhwb3J0IGNsYXNzIEdvb2dsZVRhZ01hbmFnZXJEZWZhdWx0cyBpbXBsZW1lbnRzIEdvb2dsZVRhZ01hbmFnZXJTZXR0aW5ncyB7XHJcbiAgdXNlcklkID0gbnVsbDtcclxufVxyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJ0aWNzMkdvb2dsZVRhZ01hbmFnZXIge1xyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBhbmd1bGFydGljczI6IEFuZ3VsYXJ0aWNzMikge1xyXG4gICAgLy8gVGhlIGRhdGFMYXllciBuZWVkcyB0byBiZSBpbml0aWFsaXplZFxyXG4gICAgaWYgKHR5cGVvZiBkYXRhTGF5ZXIgIT09ICd1bmRlZmluZWQnICYmIGRhdGFMYXllcikge1xyXG4gICAgICBkYXRhTGF5ZXIgPSAod2luZG93IGFzIGFueSkuZGF0YUxheWVyID0gKHdpbmRvdyBhcyBhbnkpLmRhdGFMYXllciB8fCBbXTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRlZmF1bHRzID0gbmV3IEdvb2dsZVRhZ01hbmFnZXJEZWZhdWx0cygpO1xyXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHNldHRpbmdzIGZvciB0aGlzIG1vZHVsZVxyXG4gICAgdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ3RtID0geyAuLi5kZWZhdWx0cywgLi4udGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ3RtIH07XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXRVc2VybmFtZS5zdWJzY3JpYmUoKHg6IHN0cmluZykgPT4gdGhpcy5zZXRVc2VybmFtZSh4KSk7XHJcbiAgfVxyXG5cclxuICBzdGFydFRyYWNraW5nKCkge1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIucGFnZVRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSh4ID0+IHRoaXMucGFnZVRyYWNrKHgucGF0aCkpO1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIuZXZlbnRUcmFja1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiB0aGlzLmV2ZW50VHJhY2soeC5hY3Rpb24sIHgucHJvcGVydGllcykpO1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIuZXhjZXB0aW9uVHJhY2tcclxuICAgICAgLnBpcGUodGhpcy5hbmd1bGFydGljczIuZmlsdGVyRGV2ZWxvcGVyTW9kZSgpKVxyXG4gICAgICAuc3Vic2NyaWJlKCh4OiBhbnkpID0+IHRoaXMuZXhjZXB0aW9uVHJhY2soeCkpO1xyXG4gIH1cclxuXHJcbiAgcGFnZVRyYWNrKHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5wdXNoTGF5ZXIoe1xyXG4gICAgICBldmVudDogJ1BhZ2UgVmlldycsXHJcbiAgICAgICdjb250ZW50LW5hbWUnOiBwYXRoLFxyXG4gICAgICB1c2VySWQ6IHRoaXMuYW5ndWxhcnRpY3MyLnNldHRpbmdzLmd0bS51c2VySWQsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNlbmQgRGF0YSBMYXllclxyXG4gICAqXHJcbiAgICogQGxheWVyIGRhdGEgbGF5ZXIgb2JqZWN0XHJcbiAgICovXHJcbiAgcHVzaExheWVyKGxheWVyOiBhbnkpIHtcclxuICAgIGlmICh0eXBlb2YgZGF0YUxheWVyICE9PSAndW5kZWZpbmVkJyAmJiBkYXRhTGF5ZXIpIHtcclxuICAgICAgZGF0YUxheWVyLnB1c2gobGF5ZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2VuZCBpbnRlcmFjdGlvbnMgdG8gdGhlIGRhdGFMYXllciwgaS5lLiBmb3IgZXZlbnQgdHJhY2tpbmcgaW4gR29vZ2xlIEFuYWx5dGljc1xyXG4gICAqXHJcbiAgICogQHBhcmFtIGFjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGV2ZW50XHJcbiAgICovXHJcbiAgZXZlbnRUcmFjayhhY3Rpb246IHN0cmluZywgcHJvcGVydGllczogYW55KSB7XHJcbiAgICAvLyBUT0RPOiBtYWtlIGludGVyZmFjZVxyXG4gICAgLy8gIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0aWVzLmNhdGVnb3J5XHJcbiAgICAvLyAgQHBhcmFtIHtzdHJpbmd9IFtwcm9wZXJ0aWVzLmxhYmVsXVxyXG4gICAgLy8gIEBwYXJhbSB7bnVtYmVyfSBbcHJvcGVydGllcy52YWx1ZV1cclxuICAgIC8vICBAcGFyYW0ge2Jvb2xlYW59IFtwcm9wZXJ0aWVzLm5vbmludGVyYWN0aW9uXVxyXG4gICAgLy8gU2V0IGEgZGVmYXVsdCBHVE0gY2F0ZWdvcnlcclxuICAgIHByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzIHx8IHt9O1xyXG5cclxuICAgIHRoaXMucHVzaExheWVyKHtcclxuICAgICAgZXZlbnQ6IHByb3BlcnRpZXMuZXZlbnQgfHwgJ2ludGVyYWN0aW9uJyxcclxuICAgICAgdGFyZ2V0OiBwcm9wZXJ0aWVzLmNhdGVnb3J5IHx8ICdFdmVudCcsXHJcbiAgICAgIGFjdGlvbixcclxuICAgICAgbGFiZWw6IHByb3BlcnRpZXMubGFiZWwsXHJcbiAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzLnZhbHVlLFxyXG4gICAgICBpbnRlcmFjdGlvblR5cGU6IHByb3BlcnRpZXMubm9uaW50ZXJhY3Rpb24sXHJcbiAgICAgIHVzZXJJZDogdGhpcy5hbmd1bGFydGljczIuc2V0dGluZ3MuZ3RtLnVzZXJJZCxcclxuICAgICAgLi4ucHJvcGVydGllcy5ndG1DdXN0b20sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4Y2VwdGlvbiBUcmFjayBFdmVudCBpbiBHVE1cclxuICAgKlxyXG4gICAqL1xyXG4gIGV4Y2VwdGlvblRyYWNrKHByb3BlcnRpZXM6IGFueSkge1xyXG4gICAgLy8gVE9ETzogbWFrZSBpbnRlcmZhY2VcclxuICAgIC8vICBAcGFyYW0ge09iamVjdH0gcHJvcGVydGllc1xyXG4gICAgLy8gIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0aWVzLmFwcElkXHJcbiAgICAvLyAgQHBhcmFtIHtzdHJpbmd9IHByb3BlcnRpZXMuYXBwTmFtZVxyXG4gICAgLy8gIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0aWVzLmFwcFZlcnNpb25cclxuICAgIC8vICBAcGFyYW0ge3N0cmluZ30gW3Byb3BlcnRpZXMuZGVzY3JpcHRpb25dXHJcbiAgICAvLyAgQHBhcmFtIHtib29sZWFufSBbcHJvcGVydGllcy5mYXRhbF1cclxuICAgIGlmICghcHJvcGVydGllcyB8fCAhcHJvcGVydGllcy5hcHBJZCB8fCAhcHJvcGVydGllcy5hcHBOYW1lIHx8ICFwcm9wZXJ0aWVzLmFwcFZlcnNpb24pIHtcclxuICAgICAgY29uc29sZS5lcnJvcignTXVzdCBiZSBzZXR0ZWQgYXBwSWQsIGFwcE5hbWUgYW5kIGFwcFZlcnNpb24uJyk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocHJvcGVydGllcy5mYXRhbCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdObyBcImZhdGFsXCIgcHJvdmlkZWQsIHNlbmRpbmcgd2l0aCBmYXRhbD10cnVlJyk7XHJcbiAgICAgIHByb3BlcnRpZXMuZXhGYXRhbCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvcGVydGllcy5leERlc2NyaXB0aW9uID0gcHJvcGVydGllcy5ldmVudCA/IHByb3BlcnRpZXMuZXZlbnQuc3RhY2sgOiBwcm9wZXJ0aWVzLmRlc2NyaXB0aW9uO1xyXG5cclxuICAgIHRoaXMuZXZlbnRUcmFjayhcclxuICAgICAgYEV4Y2VwdGlvbiB0aHJvd24gZm9yICR7cHJvcGVydGllcy5hcHBOYW1lfSA8JHtwcm9wZXJ0aWVzLmFwcElkfUAke3Byb3BlcnRpZXMuYXBwVmVyc2lvbn0+YCxcclxuICAgICAge1xyXG4gICAgICAgIGNhdGVnb3J5OiAnRXhjZXB0aW9uJyxcclxuICAgICAgICBsYWJlbDogcHJvcGVydGllcy5leERlc2NyaXB0aW9uLFxyXG4gICAgICB9LFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCB1c2VySWQgZm9yIHVzZSB3aXRoIFVuaXZlcnNhbCBBbmFseXRpY3MgVXNlciBJRCBmZWF0dXJlXHJcbiAgICpcclxuICAgKiBAcGFyYW0gdXNlcklkIHVzZWQgdG8gaWRlbnRpZnkgdXNlciBjcm9zcy1kZXZpY2UgaW4gR29vZ2xlIEFuYWx5dGljc1xyXG4gICAqL1xyXG4gIHNldFVzZXJuYW1lKHVzZXJJZDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXR0aW5ncy5ndG0udXNlcklkID0gdXNlcklkO1xyXG4gIH1cclxufVxyXG4iXX0=