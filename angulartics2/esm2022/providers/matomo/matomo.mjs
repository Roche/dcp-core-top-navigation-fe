import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../angulartics2-core";
export class Angulartics2Matomo {
    angulartics2;
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
        if (typeof _paq === 'undefined') {
            console.warn('Matomo not found');
        }
        this.angulartics2.setUsername.subscribe((x) => this.setUsername(x));
        this.angulartics2.setUserProperties.subscribe((x) => this.setUserProperties(x));
    }
    startTracking() {
        this.angulartics2.pageTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.pageTrack(x.path));
        this.angulartics2.eventTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe(x => this.eventTrack(x.action, x.properties));
    }
    pageTrack(path, title) {
        try {
            if (!window.location.origin) {
                window.location.origin =
                    window.location.protocol +
                        '//' +
                        window.location.hostname +
                        (window.location.port ? ':' + window.location.port : '');
            }
            _paq.push(['setDocumentTitle', title || window.document.title]);
            _paq.push(['setCustomUrl', window.location.origin + path]);
            _paq.push(['trackPageView']);
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    resetUser() {
        try {
            _paq.push(['appendToTrackingUrl', 'new_visit=1']); // (1) forces a new visit
            _paq.push(['deleteCookies']); // (2) deletes existing tracking cookies to start the new visit
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    /**
     * Track a basic event in Matomo, or send an ecommerce event.
     *
     * @param action A string corresponding to the type of event that needs to be tracked.
     * @param properties The properties that need to be logged with the event.
     */
    eventTrack(action, properties) {
        let params = [];
        switch (action) {
            /**
             * @description Sets the current page view as a product or category page view. When you call
             * setEcommerceView it must be followed by a call to trackPageView to record the product or
             * category page view.
             *
             * @link https://matomo.org/docs/ecommerce-analytics/#tracking-product-page-views-category-page-views-optional
             * @link https://developer.matomo.org/api-reference/tracking-javascript#ecommerce
             *
             * @property productSKU (required) SKU: Product unique identifier
             * @property productName (optional) Product name
             * @property categoryName (optional) Product category, or array of up to 5 categories
             * @property price (optional) Product Price as displayed on the page
             */
            case 'setEcommerceView':
                params = [
                    'setEcommerceView',
                    properties.productSKU,
                    properties.productName,
                    properties.categoryName,
                    properties.price,
                ];
                break;
            /**
             * @description Adds a product into the ecommerce order. Must be called for each product in
             * the order.
             *
             * @link https://matomo.org/docs/ecommerce-analytics/#tracking-ecommerce-orders-items-purchased-required
             * @link https://developer.matomo.org/api-reference/tracking-javascript#ecommerce
             *
             * @property productSKU (required) SKU: Product unique identifier
             * @property productName (optional) Product name
             * @property categoryName (optional) Product category, or array of up to 5 categories
             * @property price (recommended) Product price
             * @property quantity (optional, default to 1) Product quantity
             */
            case 'addEcommerceItem':
                params = [
                    'addEcommerceItem',
                    properties.productSKU,
                    properties.productName,
                    properties.productCategory,
                    properties.price,
                    properties.quantity,
                ];
                break;
            /**
             * @description Tracks a shopping cart. Call this javascript function every time a user is
             * adding, updating or deleting a product from the cart.
             *
             * @link https://matomo.org/docs/ecommerce-analytics/#tracking-add-to-cart-items-added-to-the-cart-optional
             * @link https://developer.matomo.org/api-reference/tracking-javascript#ecommerce
             *
             * @property grandTotal (required) Cart amount
             */
            case 'trackEcommerceCartUpdate':
                params = [
                    'trackEcommerceCartUpdate',
                    properties.grandTotal,
                ];
                break;
            /**
             * @description Tracks an Ecommerce order, including any ecommerce item previously added to
             * the order. orderId and grandTotal (ie. revenue) are required parameters.
             *
             * @link https://matomo.org/docs/ecommerce-analytics/#tracking-ecommerce-orders-items-purchased-required
             * @link https://developer.matomo.org/api-reference/tracking-javascript#ecommerce
             *
             * @property orderId (required) Unique Order ID
             * @property grandTotal (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
             * @property subTotal (optional) Order sub total (excludes shipping)
             * @property tax (optional) Tax amount
             * @property shipping (optional) Shipping amount
             * @property discount (optional) Discount offered (set to false for unspecified parameter)
             */
            case 'trackEcommerceOrder':
                params = [
                    'trackEcommerceOrder',
                    properties.orderId,
                    properties.grandTotal,
                    properties.subTotal,
                    properties.tax,
                    properties.shipping,
                    properties.discount,
                ];
                break;
            /**
             * @description To manually trigger an outlink
             *
             * @link https://matomo.org/docs/tracking-goals-web-analytics/
             * @link https://developer.matomo.org/guides/tracking-javascript-guide#tracking-a-click-as-an-outlink-via-css-or-javascript
             *
             * @property url (required) link url
             * @property linkType (optional) type of link
             */
            case 'trackLink':
                params = [
                    'trackLink',
                    properties.url,
                    properties.linkType,
                ];
                break;
            /**
             * @description Tracks an Ecommerce goal
             *
             * @link https://matomo.org/docs/tracking-goals-web-analytics/
             * @link https://developer.matomo.org/guides/tracking-javascript-guide#manually-trigger-goal-conversions
             *
             * @property goalId (required) Unique Goal ID
             * @property value (optional) passed to goal tracking
             */
            case 'trackGoal':
                params = [
                    'trackGoal',
                    properties.goalId,
                    properties.value,
                ];
                break;
            /**
             * @description Tracks a site search
             *
             * @link https://matomo.org/docs/site-search/
             * @link https://developer.matomo.org/guides/tracking-javascript-guide#internal-search-tracking
             *
             * @property keyword (required) Keyword searched for
             * @property category (optional) Search category
             * @property searchCount (optional) Number of results
             */
            case 'trackSiteSearch':
                params = [
                    'trackSiteSearch',
                    properties.keyword,
                    properties.category,
                    properties.searchCount,
                ];
                break;
            /**
             * @description Logs an event with an event category (Videos, Music, Games...), an event
             * action (Play, Pause, Duration, Add Playlist, Downloaded, Clicked...), and an optional
             * event name and optional numeric value.
             *
             * @link https://matomo.org/docs/event-tracking/
             * @link https://developer.matomo.org/api-reference/tracking-javascript#using-the-tracker-object
             *
             * @property category
             * @property action
             * @property name (optional, recommended)
             * @property value (optional)
             */
            default:
                // PAQ requires that eventValue be an integer, see: http://matomo.org/docs/event-tracking
                if (properties.value) {
                    const parsed = parseInt(properties.value, 10);
                    properties.value = isNaN(parsed) ? 0 : parsed;
                }
                params = [
                    'trackEvent',
                    properties.category,
                    action,
                    properties.name ||
                        properties.label,
                    properties.value,
                ];
        }
        try {
            _paq.push(params);
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    setUsername(userId) {
        try {
            _paq.push(['setUserId', userId]);
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    /**
     * Sets custom dimensions if at least one property has the key "dimension<n>",
     * e.g. dimension10. If there are custom dimensions, any other property is ignored.
     *
     * If there are no custom dimensions in the given properties object, the properties
     * object is saved as a custom variable.
     *
     * If in doubt, prefer custom dimensions.
     * @link https://matomo.org/docs/custom-variables/
     */
    setUserProperties(properties) {
        const dimensions = this.setCustomDimensions(properties);
        try {
            if (dimensions.length === 0) {
                _paq.push([
                    'setCustomVariable',
                    properties.index,
                    properties.name,
                    properties.value,
                    properties.scope,
                ]);
            }
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    /**
     * If you created a custom variable and then decide to remove this variable from
     * a visit or page view, you can use deleteCustomVariable.
     *
     * @link https://developer.matomo.org/guides/tracking-javascript-guide#deleting-a-custom-variable
     */
    deletedUserProperties(properties) {
        try {
            _paq.push(['deleteCustomVariable', properties.index, properties.scope]);
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    setCustomDimensions(properties) {
        const dimensionRegex = /dimension[1-9]\d*/;
        const dimensions = Object.keys(properties).filter(key => dimensionRegex.exec(key));
        dimensions.forEach(dimension => {
            const number = Number(dimension.substr(9));
            _paq.push(['setCustomDimension', number, properties[dimension]]);
        });
        return dimensions;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Matomo, deps: [{ token: i1.Angulartics2 }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Matomo, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Matomo, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.Angulartics2 }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0b21vLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm92aWRlcnMvbWF0b21vL21hdG9tby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUE4STNDLE1BQU0sT0FBTyxrQkFBa0I7SUFDVDtJQUFwQixZQUFvQixZQUEwQjtRQUExQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUM1QyxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUMvQixPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDbEM7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQ3ZELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FDMUIsQ0FBQztJQUNKLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTO2FBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDN0MsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVU7YUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUM3QyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxN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QUU7Z0JBQ2xDLE1BQU0sQ0FBQyxDQUFDO2FBQ1Q7U0FDRjtJQUNILENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxVQUEwRTtRQUNwRyxNQUFNLGNBQWMsR0FBVyxtQkFBbUIsQ0FBQztRQUNuRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNuRixVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzdCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQzt3R0ExVFUsa0JBQWtCOzRHQUFsQixrQkFBa0IsY0FETCxNQUFNOzs0RkFDbkIsa0JBQWtCO2tCQUQ5QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IEFuZ3VsYXJ0aWNzMiB9IGZyb20gJy4uLy4uL2FuZ3VsYXJ0aWNzMi1jb3JlJztcclxuXHJcbmRlY2xhcmUgdmFyIF9wYXE6IGFueTtcclxuXHJcbmV4cG9ydCB0eXBlIEV2ZW50VHJhY2tBY3Rpb24gPVxyXG4gIHwgJ3NldEVjb21tZXJjZVZpZXcnXHJcbiAgfCAnYWRkRWNvbW1lcmNlSXRlbSdcclxuICB8ICd0cmFja0Vjb21tZXJjZUNhcnRVcGRhdGUnXHJcbiAgfCAndHJhY2tFY29tbWVyY2VPcmRlcidcclxuICB8ICd0cmFja0xpbmsnXHJcbiAgfCAndHJhY2tHb2FsJ1xyXG4gIHwgJ3RyYWNrU2l0ZVNlYXJjaCdcclxuICB8IHN0cmluZztcclxuXHJcbmV4cG9ydCB0eXBlIFNjb3BlTWF0b21vID0gJ3Zpc2l0JyB8ICdwYWdlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGltZW5zaW9uc01hdG9tb1Byb3BlcnRpZXMge1xyXG4gIGRpbWVuc2lvbjE/OiBzdHJpbmc7XHJcbiAgZGltZW5zaW9uMj86IHN0cmluZztcclxuICBkaW1lbnNpb24zPzogc3RyaW5nO1xyXG4gIGRpbWVuc2lvbjQ/OiBzdHJpbmc7XHJcbiAgZGltZW5zaW9uNT86IHN0cmluZztcclxuICBkaW1lbnNpb242Pzogc3RyaW5nO1xyXG4gIGRpbWVuc2lvbjc/OiBzdHJpbmc7XHJcbiAgZGltZW5zaW9uOD86IHN0cmluZztcclxuICBkaW1lbnNpb245Pzogc3RyaW5nO1xyXG4gIGRpbWVuc2lvbjEwPzogc3RyaW5nO1xyXG4gIGRpbWVuc2lvbjExPzogc3RyaW5nO1xyXG4gIGRpbWVuc2lvbjEyPzogc3RyaW5nO1xyXG4gIGRpbWVuc2lvbjEzPzogc3RyaW5nO1xyXG4gIGRpbWVuc2lvbjE0Pzogc3RyaW5nO1xyXG4gIGRpbWVuc2lvbjE1Pzogc3RyaW5nO1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgU2V0RWNvbW1lcmNlVmlld01hdG9tb1Byb3BlcnRpZXMge1xyXG4gIC8qKiBAY2xhc3MgU2V0RWNvbW1lcmNlVmlld01hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBwcm9kdWN0U0tVOiBzdHJpbmc7XHJcbiAgLyoqIEBjbGFzcyBTZXRFY29tbWVyY2VWaWV3TWF0b21vUHJvcGVydGllcyAqL1xyXG4gIHByb2R1Y3ROYW1lOiBzdHJpbmc7XHJcbiAgLyoqIEBjbGFzcyBTZXRFY29tbWVyY2VWaWV3TWF0b21vUHJvcGVydGllcyAqL1xyXG4gIGNhdGVnb3J5TmFtZTogc3RyaW5nO1xyXG4gIC8qKiBAY2xhc3MgU2V0RWNvbW1lcmNlVmlld01hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBwcmljZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFkZEVjb21tZXJjZUl0ZW1Qcm9wZXJ0aWVzIHtcclxuICAvKiogQGNsYXNzIEFkZEVjb21tZXJjZUl0ZW1Qcm9wZXJ0aWVzICovXHJcbiAgcHJvZHVjdFNLVTogc3RyaW5nO1xyXG4gIC8qKiBAY2xhc3MgQWRkRWNvbW1lcmNlSXRlbVByb3BlcnRpZXMgKi9cclxuICBwcm9kdWN0TmFtZTogc3RyaW5nO1xyXG4gIC8qKiBAY2xhc3MgQWRkRWNvbW1lcmNlSXRlbVByb3BlcnRpZXMgKi9cclxuICBwcm9kdWN0Q2F0ZWdvcnk6IHN0cmluZztcclxuICAvKiogQGNsYXNzIEFkZEVjb21tZXJjZUl0ZW1Qcm9wZXJ0aWVzICovXHJcbiAgcHJpY2U6IHN0cmluZztcclxuICAvKiogQGNsYXNzIEFkZEVjb21tZXJjZUl0ZW1Qcm9wZXJ0aWVzICovXHJcbiAgcXVhbnRpdHk6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUcmFja0Vjb21tZXJjZUNhcnRVcGRhdGVNYXRvbW9Qcm9wZXJ0aWVzIHtcclxuICAvKiogQGNsYXNzIFRyYWNrRWNvbW1lcmNlQ2FydFVwZGF0ZU1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBncmFuZFRvdGFsOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhY2tFY29tbWVyY2VPcmRlck1hdG9tb1Byb3BlcnRpZXMge1xyXG4gIC8qKiBAY2xhc3MgVHJhY2tFY29tbWVyY2VPcmRlck1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBvcmRlcklkOiBzdHJpbmc7XHJcbiAgLyoqIEBjbGFzcyBUcmFja0Vjb21tZXJjZU9yZGVyTWF0b21vUHJvcGVydGllcyAqL1xyXG4gIGdyYW5kVG90YWw6IHN0cmluZztcclxuICAvKiogQGNsYXNzIFRyYWNrRWNvbW1lcmNlT3JkZXJNYXRvbW9Qcm9wZXJ0aWVzICovXHJcbiAgc3ViVG90YWw6IHN0cmluZztcclxuICAvKiogQGNsYXNzIFRyYWNrRWNvbW1lcmNlT3JkZXJNYXRvbW9Qcm9wZXJ0aWVzICovXHJcbiAgdGF4OiBzdHJpbmc7XHJcbiAgLyoqIEBjbGFzcyBUcmFja0Vjb21tZXJjZU9yZGVyTWF0b21vUHJvcGVydGllcyAqL1xyXG4gIHNoaXBwaW5nOiBzdHJpbmc7XHJcbiAgLyoqIEBjbGFzcyBUcmFja0Vjb21tZXJjZU9yZGVyTWF0b21vUHJvcGVydGllcyAqL1xyXG4gIGRpc2NvdW50OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhY2tMaW5rTWF0b21vUHJvcGVydGllcyB7XHJcbiAgLyoqIEBjbGFzcyBUcmFja0xpbmtNYXRvbW9Qcm9wZXJ0aWVzICovXHJcbiAgdXJsOiBzdHJpbmc7XHJcbiAgLyoqIEBjbGFzcyBUcmFja0xpbmtNYXRvbW9Qcm9wZXJ0aWVzICovXHJcbiAgbGlua1R5cGU6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBUcmFja0dvYWxNYXRvbW9Qcm9wZXJ0aWVzIHtcclxuICAvKiogQGNsYXNzIFRyYWNrR29hbE1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBnb2FsSWQ6IHN0cmluZztcclxuICAvKiogQGNsYXNzIFRyYWNrR29hbE1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICB2YWx1ZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFRyYWNrU2l0ZVNlYXJjaE1hdG9tb1Byb3BlcnRpZXMge1xyXG4gIC8qKiBAY2xhc3MgVHJhY2tTaXRlU2VhcmNoTWF0b21vUHJvcGVydGllcyAqL1xyXG4gIGtleXdvcmQ6IHN0cmluZztcclxuICAvKiogQGNsYXNzIFRyYWNrU2l0ZVNlYXJjaE1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBjYXRlZ29yeTogc3RyaW5nO1xyXG4gIC8qKiBAY2xhc3MgVHJhY2tTaXRlU2VhcmNoTWF0b21vUHJvcGVydGllcyAqL1xyXG4gIHNlYXJjaENvdW50OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVHJhY2tFdmVudE1hdG9tb1Byb3BlcnRpZXMge1xyXG4gIC8qKiBAY2xhc3MgVHJhY2tFdmVudE1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBjYXRlZ29yeTogc3RyaW5nO1xyXG4gIC8qKiBAY2xhc3MgVHJhY2tFdmVudE1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBuYW1lPzogc3RyaW5nO1xyXG4gIC8qKiBAY2xhc3MgVHJhY2tFdmVudE1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBsYWJlbD86IHN0cmluZztcclxuICAvKiogQGNsYXNzIFRyYWNrRXZlbnRNYXRvbW9Qcm9wZXJ0aWVzICovXHJcbiAgdmFsdWU/OiBudW1iZXIgfCBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2V0Q3VzdG9tVmFyaWFibGVNYXRvbW9Qcm9wZXJ0aWVzIHtcclxuICAvKiogQGNsYXNzIFNldEN1c3RvbVZhcmlhYmxlTWF0b21vUHJvcGVydGllcyAqL1xyXG4gIGluZGV4OiBudW1iZXI7XHJcbiAgLyoqIEBjbGFzcyBTZXRDdXN0b21WYXJpYWJsZU1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgLyoqIEBjbGFzcyBTZXRDdXN0b21WYXJpYWJsZU1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICB2YWx1ZTogc3RyaW5nO1xyXG4gIC8qKiBAY2xhc3MgU2V0Q3VzdG9tVmFyaWFibGVNYXRvbW9Qcm9wZXJ0aWVzICovXHJcbiAgc2NvcGU6IFNjb3BlTWF0b21vO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERlbGV0ZUN1c3RvbVZhcmlhYmxlTWF0b21vUHJvcGVydGllcyB7XHJcbiAgLyoqIEBjbGFzcyBEZWxldGVDdXN0b21WYXJpYWJsZU1hdG9tb1Byb3BlcnRpZXMgKi9cclxuICBpbmRleDogbnVtYmVyO1xyXG4gIC8qKiBAY2xhc3MgRGVsZXRlQ3VzdG9tVmFyaWFibGVNYXRvbW9Qcm9wZXJ0aWVzICovXHJcbiAgc2NvcGU6IFNjb3BlTWF0b21vO1xyXG59XHJcblxyXG5leHBvcnQgdHlwZSBFdmVudFRyYWNrYWN0aW9uUHJvcGVydGllcyA9XHJcbiAgfCBTZXRFY29tbWVyY2VWaWV3TWF0b21vUHJvcGVydGllc1xyXG4gIHwgQWRkRWNvbW1lcmNlSXRlbVByb3BlcnRpZXNcclxuICB8IFRyYWNrRWNvbW1lcmNlQ2FydFVwZGF0ZU1hdG9tb1Byb3BlcnRpZXNcclxuICB8IFRyYWNrRWNvbW1lcmNlT3JkZXJNYXRvbW9Qcm9wZXJ0aWVzXHJcbiAgfCBUcmFja0xpbmtNYXRvbW9Qcm9wZXJ0aWVzXHJcbiAgfCBUcmFja0dvYWxNYXRvbW9Qcm9wZXJ0aWVzXHJcbiAgfCBUcmFja1NpdGVTZWFyY2hNYXRvbW9Qcm9wZXJ0aWVzXHJcbiAgfCBUcmFja0V2ZW50TWF0b21vUHJvcGVydGllcztcclxuXHJcbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXHJcbmV4cG9ydCBjbGFzcyBBbmd1bGFydGljczJNYXRvbW8ge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYW5ndWxhcnRpY3MyOiBBbmd1bGFydGljczIpIHtcclxuICAgIGlmICh0eXBlb2YgX3BhcSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdNYXRvbW8gbm90IGZvdW5kJyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXRVc2VybmFtZS5zdWJzY3JpYmUoKHg6IHN0cmluZykgPT4gdGhpcy5zZXRVc2VybmFtZSh4KSk7XHJcbiAgICB0aGlzLmFuZ3VsYXJ0aWNzMi5zZXRVc2VyUHJvcGVydGllcy5zdWJzY3JpYmUoKHg6IGFueSkgPT5cclxuICAgICAgdGhpcy5zZXRVc2VyUHJvcGVydGllcyh4KSxcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBzdGFydFRyYWNraW5nKCk6IHZvaWQge1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIucGFnZVRyYWNrXHJcbiAgICAgIC5waXBlKHRoaXMuYW5ndWxhcnRpY3MyLmZpbHRlckRldmVsb3Blck1vZGUoKSlcclxuICAgICAgLnN1YnNjcmliZSh4ID0+IHRoaXMucGFnZVRyYWNrKHgucGF0aCkpO1xyXG4gICAgdGhpcy5hbmd1bGFydGljczIuZXZlbnRUcmFja1xyXG4gICAgICAucGlwZSh0aGlzLmFuZ3VsYXJ0aWNzMi5maWx0ZXJEZXZlbG9wZXJNb2RlKCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoeCA9PiB0aGlzLmV2ZW50VHJhY2soeC5hY3Rpb24sIHgucHJvcGVydGllcykpO1xyXG4gIH1cclxuXHJcbiAgcGFnZVRyYWNrKHBhdGg6IHN0cmluZywgdGl0bGU/OiBzdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICghd2luZG93LmxvY2F0aW9uLm9yaWdpbikge1xyXG4gICAgICAgICh3aW5kb3cubG9jYXRpb24gYXMgYW55KS5vcmlnaW4gPVxyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLnByb3RvY29sICtcclxuICAgICAgICAgICcvLycgK1xyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICtcclxuICAgICAgICAgICh3aW5kb3cubG9jYXRpb24ucG9ydCA/ICc6JyArIHdpbmRvdy5sb2NhdGlvbi5wb3J0IDogJycpO1xyXG4gICAgICB9XHJcbiAgICAgIF9wYXEucHVzaChbJ3NldERvY3VtZW50VGl0bGUnLCB0aXRsZSB8fCB3aW5kb3cuZG9jdW1lbnQudGl0bGVdKTtcclxuICAgICAgX3BhcS5wdXNoKFsnc2V0Q3VzdG9tVXJsJywgd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIHBhdGhdKTtcclxuICAgICAgX3BhcS5wdXNoKFsndHJhY2tQYWdlVmlldyddKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIFJlZmVyZW5jZUVycm9yKSkge1xyXG4gICAgICAgIHRocm93IGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlc2V0VXNlcigpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIF9wYXEucHVzaChbJ2FwcGVuZFRvVHJhY2tpbmdVcmwnLCAnbmV3X3Zpc2l0PTEnXSk7IC8vICgxKSBmb3JjZXMgYSBuZXcgdmlzaXRcclxuICAgICAgX3BhcS5wdXNoKFsnZGVsZXRlQ29va2llcyddKTsgLy8gKDIpIGRlbGV0ZXMgZXhpc3RpbmcgdHJhY2tpbmcgY29va2llcyB0byBzdGFydCB0aGUgbmV3IHZpc2l0XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBSZWZlcmVuY2VFcnJvcikpIHtcclxuICAgICAgICB0aHJvdyBlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBldmVudFRyYWNrKGFjdGlvbjogJ3NldEVjb21tZXJjZVZpZXcnLCBwcm9wZXJ0aWVzOiBTZXRFY29tbWVyY2VWaWV3TWF0b21vUHJvcGVydGllcyk6IHZvaWQ7XHJcbiAgZXZlbnRUcmFjayhhY3Rpb246ICdhZGRFY29tbWVyY2VJdGVtJywgcHJvcGVydGllczogQWRkRWNvbW1lcmNlSXRlbVByb3BlcnRpZXMpOiB2b2lkO1xyXG4gIGV2ZW50VHJhY2soXHJcbiAgICBhY3Rpb246ICd0cmFja0Vjb21tZXJjZUNhcnRVcGRhdGUnLFxyXG4gICAgcHJvcGVydGllczogVHJhY2tFY29tbWVyY2VDYXJ0VXBkYXRlTWF0b21vUHJvcGVydGllcyxcclxuICApOiB2b2lkO1xyXG4gIGV2ZW50VHJhY2soYWN0aW9uOiAndHJhY2tFY29tbWVyY2VPcmRlcicsIHByb3BlcnRpZXM6IFRyYWNrRWNvbW1lcmNlT3JkZXJNYXRvbW9Qcm9wZXJ0aWVzKTogdm9pZDtcclxuICBldmVudFRyYWNrKGFjdGlvbjogJ3RyYWNrTGluaycsIHByb3BlcnRpZXM6IFRyYWNrTGlua01hdG9tb1Byb3BlcnRpZXMpOiB2b2lkO1xyXG4gIGV2ZW50VHJhY2soYWN0aW9uOiAndHJhY2tHb2FsJywgcHJvcGVydGllczogVHJhY2tHb2FsTWF0b21vUHJvcGVydGllcyk6IHZvaWQ7XHJcbiAgZXZlbnRUcmFjayhhY3Rpb246ICd0cmFja1NpdGVTZWFyY2gnLCBwcm9wZXJ0aWVzOiBUcmFja1NpdGVTZWFyY2hNYXRvbW9Qcm9wZXJ0aWVzKTogdm9pZDtcclxuICBldmVudFRyYWNrKGFjdGlvbjogc3RyaW5nLCBwcm9wZXJ0aWVzOiBUcmFja0V2ZW50TWF0b21vUHJvcGVydGllcyk6IHZvaWQ7XHJcblxyXG4gIC8qKlxyXG4gICAqIFRyYWNrIGEgYmFzaWMgZXZlbnQgaW4gTWF0b21vLCBvciBzZW5kIGFuIGVjb21tZXJjZSBldmVudC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSBhY3Rpb24gQSBzdHJpbmcgY29ycmVzcG9uZGluZyB0byB0aGUgdHlwZSBvZiBldmVudCB0aGF0IG5lZWRzIHRvIGJlIHRyYWNrZWQuXHJcbiAgICogQHBhcmFtIHByb3BlcnRpZXMgVGhlIHByb3BlcnRpZXMgdGhhdCBuZWVkIHRvIGJlIGxvZ2dlZCB3aXRoIHRoZSBldmVudC5cclxuICAgKi9cclxuICBldmVudFRyYWNrKGFjdGlvbjogRXZlbnRUcmFja0FjdGlvbiwgcHJvcGVydGllcz86IEV2ZW50VHJhY2thY3Rpb25Qcm9wZXJ0aWVzKSB7XHJcbiAgICBsZXQgcGFyYW1zID0gW107XHJcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIFNldHMgdGhlIGN1cnJlbnQgcGFnZSB2aWV3IGFzIGEgcHJvZHVjdCBvciBjYXRlZ29yeSBwYWdlIHZpZXcuIFdoZW4geW91IGNhbGxcclxuICAgICAgICogc2V0RWNvbW1lcmNlVmlldyBpdCBtdXN0IGJlIGZvbGxvd2VkIGJ5IGEgY2FsbCB0byB0cmFja1BhZ2VWaWV3IHRvIHJlY29yZCB0aGUgcHJvZHVjdCBvclxyXG4gICAgICAgKiBjYXRlZ29yeSBwYWdlIHZpZXcuXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9kb2NzL2Vjb21tZXJjZS1hbmFseXRpY3MvI3RyYWNraW5nLXByb2R1Y3QtcGFnZS12aWV3cy1jYXRlZ29yeS1wYWdlLXZpZXdzLW9wdGlvbmFsXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvYXBpLXJlZmVyZW5jZS90cmFja2luZy1qYXZhc2NyaXB0I2Vjb21tZXJjZVxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAcHJvcGVydHkgcHJvZHVjdFNLVSAocmVxdWlyZWQpIFNLVTogUHJvZHVjdCB1bmlxdWUgaWRlbnRpZmllclxyXG4gICAgICAgKiBAcHJvcGVydHkgcHJvZHVjdE5hbWUgKG9wdGlvbmFsKSBQcm9kdWN0IG5hbWVcclxuICAgICAgICogQHByb3BlcnR5IGNhdGVnb3J5TmFtZSAob3B0aW9uYWwpIFByb2R1Y3QgY2F0ZWdvcnksIG9yIGFycmF5IG9mIHVwIHRvIDUgY2F0ZWdvcmllc1xyXG4gICAgICAgKiBAcHJvcGVydHkgcHJpY2UgKG9wdGlvbmFsKSBQcm9kdWN0IFByaWNlIGFzIGRpc3BsYXllZCBvbiB0aGUgcGFnZVxyXG4gICAgICAgKi9cclxuICAgICAgY2FzZSAnc2V0RWNvbW1lcmNlVmlldyc6XHJcbiAgICAgICAgcGFyYW1zID0gW1xyXG4gICAgICAgICAgJ3NldEVjb21tZXJjZVZpZXcnLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgU2V0RWNvbW1lcmNlVmlld01hdG9tb1Byb3BlcnRpZXMpLnByb2R1Y3RTS1UsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBTZXRFY29tbWVyY2VWaWV3TWF0b21vUHJvcGVydGllcykucHJvZHVjdE5hbWUsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBTZXRFY29tbWVyY2VWaWV3TWF0b21vUHJvcGVydGllcykuY2F0ZWdvcnlOYW1lLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgU2V0RWNvbW1lcmNlVmlld01hdG9tb1Byb3BlcnRpZXMpLnByaWNlLFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIEFkZHMgYSBwcm9kdWN0IGludG8gdGhlIGVjb21tZXJjZSBvcmRlci4gTXVzdCBiZSBjYWxsZWQgZm9yIGVhY2ggcHJvZHVjdCBpblxyXG4gICAgICAgKiB0aGUgb3JkZXIuXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9kb2NzL2Vjb21tZXJjZS1hbmFseXRpY3MvI3RyYWNraW5nLWVjb21tZXJjZS1vcmRlcnMtaXRlbXMtcHVyY2hhc2VkLXJlcXVpcmVkXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvYXBpLXJlZmVyZW5jZS90cmFja2luZy1qYXZhc2NyaXB0I2Vjb21tZXJjZVxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAcHJvcGVydHkgcHJvZHVjdFNLVSAocmVxdWlyZWQpIFNLVTogUHJvZHVjdCB1bmlxdWUgaWRlbnRpZmllclxyXG4gICAgICAgKiBAcHJvcGVydHkgcHJvZHVjdE5hbWUgKG9wdGlvbmFsKSBQcm9kdWN0IG5hbWVcclxuICAgICAgICogQHByb3BlcnR5IGNhdGVnb3J5TmFtZSAob3B0aW9uYWwpIFByb2R1Y3QgY2F0ZWdvcnksIG9yIGFycmF5IG9mIHVwIHRvIDUgY2F0ZWdvcmllc1xyXG4gICAgICAgKiBAcHJvcGVydHkgcHJpY2UgKHJlY29tbWVuZGVkKSBQcm9kdWN0IHByaWNlXHJcbiAgICAgICAqIEBwcm9wZXJ0eSBxdWFudGl0eSAob3B0aW9uYWwsIGRlZmF1bHQgdG8gMSkgUHJvZHVjdCBxdWFudGl0eVxyXG4gICAgICAgKi9cclxuICAgICAgY2FzZSAnYWRkRWNvbW1lcmNlSXRlbSc6XHJcbiAgICAgICAgcGFyYW1zID0gW1xyXG4gICAgICAgICAgJ2FkZEVjb21tZXJjZUl0ZW0nLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgQWRkRWNvbW1lcmNlSXRlbVByb3BlcnRpZXMpLnByb2R1Y3RTS1UsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBBZGRFY29tbWVyY2VJdGVtUHJvcGVydGllcykucHJvZHVjdE5hbWUsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBBZGRFY29tbWVyY2VJdGVtUHJvcGVydGllcykucHJvZHVjdENhdGVnb3J5LFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgQWRkRWNvbW1lcmNlSXRlbVByb3BlcnRpZXMpLnByaWNlLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgQWRkRWNvbW1lcmNlSXRlbVByb3BlcnRpZXMpLnF1YW50aXR5LFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAvKipcclxuICAgICAgICogQGRlc2NyaXB0aW9uIFRyYWNrcyBhIHNob3BwaW5nIGNhcnQuIENhbGwgdGhpcyBqYXZhc2NyaXB0IGZ1bmN0aW9uIGV2ZXJ5IHRpbWUgYSB1c2VyIGlzXHJcbiAgICAgICAqIGFkZGluZywgdXBkYXRpbmcgb3IgZGVsZXRpbmcgYSBwcm9kdWN0IGZyb20gdGhlIGNhcnQuXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9kb2NzL2Vjb21tZXJjZS1hbmFseXRpY3MvI3RyYWNraW5nLWFkZC10by1jYXJ0LWl0ZW1zLWFkZGVkLXRvLXRoZS1jYXJ0LW9wdGlvbmFsXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvYXBpLXJlZmVyZW5jZS90cmFja2luZy1qYXZhc2NyaXB0I2Vjb21tZXJjZVxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAcHJvcGVydHkgZ3JhbmRUb3RhbCAocmVxdWlyZWQpIENhcnQgYW1vdW50XHJcbiAgICAgICAqL1xyXG4gICAgICBjYXNlICd0cmFja0Vjb21tZXJjZUNhcnRVcGRhdGUnOlxyXG4gICAgICAgIHBhcmFtcyA9IFtcclxuICAgICAgICAgICd0cmFja0Vjb21tZXJjZUNhcnRVcGRhdGUnLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tFY29tbWVyY2VDYXJ0VXBkYXRlTWF0b21vUHJvcGVydGllcykuZ3JhbmRUb3RhbCxcclxuICAgICAgICBdO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBUcmFja3MgYW4gRWNvbW1lcmNlIG9yZGVyLCBpbmNsdWRpbmcgYW55IGVjb21tZXJjZSBpdGVtIHByZXZpb3VzbHkgYWRkZWQgdG9cclxuICAgICAgICogdGhlIG9yZGVyLiBvcmRlcklkIGFuZCBncmFuZFRvdGFsIChpZS4gcmV2ZW51ZSkgYXJlIHJlcXVpcmVkIHBhcmFtZXRlcnMuXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9kb2NzL2Vjb21tZXJjZS1hbmFseXRpY3MvI3RyYWNraW5nLWVjb21tZXJjZS1vcmRlcnMtaXRlbXMtcHVyY2hhc2VkLXJlcXVpcmVkXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvYXBpLXJlZmVyZW5jZS90cmFja2luZy1qYXZhc2NyaXB0I2Vjb21tZXJjZVxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAcHJvcGVydHkgb3JkZXJJZCAocmVxdWlyZWQpIFVuaXF1ZSBPcmRlciBJRFxyXG4gICAgICAgKiBAcHJvcGVydHkgZ3JhbmRUb3RhbCAocmVxdWlyZWQpIE9yZGVyIFJldmVudWUgZ3JhbmQgdG90YWwgKGluY2x1ZGVzIHRheCwgc2hpcHBpbmcsIGFuZCBzdWJ0cmFjdGVkIGRpc2NvdW50KVxyXG4gICAgICAgKiBAcHJvcGVydHkgc3ViVG90YWwgKG9wdGlvbmFsKSBPcmRlciBzdWIgdG90YWwgKGV4Y2x1ZGVzIHNoaXBwaW5nKVxyXG4gICAgICAgKiBAcHJvcGVydHkgdGF4IChvcHRpb25hbCkgVGF4IGFtb3VudFxyXG4gICAgICAgKiBAcHJvcGVydHkgc2hpcHBpbmcgKG9wdGlvbmFsKSBTaGlwcGluZyBhbW91bnRcclxuICAgICAgICogQHByb3BlcnR5IGRpc2NvdW50IChvcHRpb25hbCkgRGlzY291bnQgb2ZmZXJlZCAoc2V0IHRvIGZhbHNlIGZvciB1bnNwZWNpZmllZCBwYXJhbWV0ZXIpXHJcbiAgICAgICAqL1xyXG4gICAgICBjYXNlICd0cmFja0Vjb21tZXJjZU9yZGVyJzpcclxuICAgICAgICBwYXJhbXMgPSBbXHJcbiAgICAgICAgICAndHJhY2tFY29tbWVyY2VPcmRlcicsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBUcmFja0Vjb21tZXJjZU9yZGVyTWF0b21vUHJvcGVydGllcykub3JkZXJJZCxcclxuICAgICAgICAgIChwcm9wZXJ0aWVzIGFzIFRyYWNrRWNvbW1lcmNlT3JkZXJNYXRvbW9Qcm9wZXJ0aWVzKS5ncmFuZFRvdGFsLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tFY29tbWVyY2VPcmRlck1hdG9tb1Byb3BlcnRpZXMpLnN1YlRvdGFsLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tFY29tbWVyY2VPcmRlck1hdG9tb1Byb3BlcnRpZXMpLnRheCxcclxuICAgICAgICAgIChwcm9wZXJ0aWVzIGFzIFRyYWNrRWNvbW1lcmNlT3JkZXJNYXRvbW9Qcm9wZXJ0aWVzKS5zaGlwcGluZyxcclxuICAgICAgICAgIChwcm9wZXJ0aWVzIGFzIFRyYWNrRWNvbW1lcmNlT3JkZXJNYXRvbW9Qcm9wZXJ0aWVzKS5kaXNjb3VudCxcclxuICAgICAgICBdO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBUbyBtYW51YWxseSB0cmlnZ2VyIGFuIG91dGxpbmtcclxuICAgICAgICpcclxuICAgICAgICogQGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2RvY3MvdHJhY2tpbmctZ29hbHMtd2ViLWFuYWx5dGljcy9cclxuICAgICAgICogQGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubWF0b21vLm9yZy9ndWlkZXMvdHJhY2tpbmctamF2YXNjcmlwdC1ndWlkZSN0cmFja2luZy1hLWNsaWNrLWFzLWFuLW91dGxpbmstdmlhLWNzcy1vci1qYXZhc2NyaXB0XHJcbiAgICAgICAqXHJcbiAgICAgICAqIEBwcm9wZXJ0eSB1cmwgKHJlcXVpcmVkKSBsaW5rIHVybFxyXG4gICAgICAgKiBAcHJvcGVydHkgbGlua1R5cGUgKG9wdGlvbmFsKSB0eXBlIG9mIGxpbmtcclxuICAgICAgICovXHJcbiAgICAgIGNhc2UgJ3RyYWNrTGluayc6XHJcbiAgICAgICAgcGFyYW1zID0gW1xyXG4gICAgICAgICAgJ3RyYWNrTGluaycsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBUcmFja0xpbmtNYXRvbW9Qcm9wZXJ0aWVzKS51cmwsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBUcmFja0xpbmtNYXRvbW9Qcm9wZXJ0aWVzKS5saW5rVHlwZSxcclxuICAgICAgICBdO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgLyoqXHJcbiAgICAgICAqIEBkZXNjcmlwdGlvbiBUcmFja3MgYW4gRWNvbW1lcmNlIGdvYWxcclxuICAgICAgICpcclxuICAgICAgICogQGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2RvY3MvdHJhY2tpbmctZ29hbHMtd2ViLWFuYWx5dGljcy9cclxuICAgICAgICogQGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubWF0b21vLm9yZy9ndWlkZXMvdHJhY2tpbmctamF2YXNjcmlwdC1ndWlkZSNtYW51YWxseS10cmlnZ2VyLWdvYWwtY29udmVyc2lvbnNcclxuICAgICAgICpcclxuICAgICAgICogQHByb3BlcnR5IGdvYWxJZCAocmVxdWlyZWQpIFVuaXF1ZSBHb2FsIElEXHJcbiAgICAgICAqIEBwcm9wZXJ0eSB2YWx1ZSAob3B0aW9uYWwpIHBhc3NlZCB0byBnb2FsIHRyYWNraW5nXHJcbiAgICAgICAqL1xyXG4gICAgICBjYXNlICd0cmFja0dvYWwnOlxyXG4gICAgICAgIHBhcmFtcyA9IFtcclxuICAgICAgICAgICd0cmFja0dvYWwnLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tHb2FsTWF0b21vUHJvcGVydGllcykuZ29hbElkLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tHb2FsTWF0b21vUHJvcGVydGllcykudmFsdWUsXHJcbiAgICAgICAgXTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gVHJhY2tzIGEgc2l0ZSBzZWFyY2hcclxuICAgICAgICpcclxuICAgICAgICogQGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2RvY3Mvc2l0ZS1zZWFyY2gvXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvZ3VpZGVzL3RyYWNraW5nLWphdmFzY3JpcHQtZ3VpZGUjaW50ZXJuYWwtc2VhcmNoLXRyYWNraW5nXHJcbiAgICAgICAqXHJcbiAgICAgICAqIEBwcm9wZXJ0eSBrZXl3b3JkIChyZXF1aXJlZCkgS2V5d29yZCBzZWFyY2hlZCBmb3JcclxuICAgICAgICogQHByb3BlcnR5IGNhdGVnb3J5IChvcHRpb25hbCkgU2VhcmNoIGNhdGVnb3J5XHJcbiAgICAgICAqIEBwcm9wZXJ0eSBzZWFyY2hDb3VudCAob3B0aW9uYWwpIE51bWJlciBvZiByZXN1bHRzXHJcbiAgICAgICAqL1xyXG4gICAgICBjYXNlICd0cmFja1NpdGVTZWFyY2gnOlxyXG4gICAgICAgIHBhcmFtcyA9IFtcclxuICAgICAgICAgICd0cmFja1NpdGVTZWFyY2gnLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tTaXRlU2VhcmNoTWF0b21vUHJvcGVydGllcykua2V5d29yZCxcclxuICAgICAgICAgIChwcm9wZXJ0aWVzIGFzIFRyYWNrU2l0ZVNlYXJjaE1hdG9tb1Byb3BlcnRpZXMpLmNhdGVnb3J5LFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tTaXRlU2VhcmNoTWF0b21vUHJvcGVydGllcykuc2VhcmNoQ291bnQsXHJcbiAgICAgICAgXTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhbiBldmVudCB3aXRoIGFuIGV2ZW50IGNhdGVnb3J5IChWaWRlb3MsIE11c2ljLCBHYW1lcy4uLiksIGFuIGV2ZW50XHJcbiAgICAgICAqIGFjdGlvbiAoUGxheSwgUGF1c2UsIER1cmF0aW9uLCBBZGQgUGxheWxpc3QsIERvd25sb2FkZWQsIENsaWNrZWQuLi4pLCBhbmQgYW4gb3B0aW9uYWxcclxuICAgICAgICogZXZlbnQgbmFtZSBhbmQgb3B0aW9uYWwgbnVtZXJpYyB2YWx1ZS5cclxuICAgICAgICpcclxuICAgICAgICogQGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2RvY3MvZXZlbnQtdHJhY2tpbmcvXHJcbiAgICAgICAqIEBsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvYXBpLXJlZmVyZW5jZS90cmFja2luZy1qYXZhc2NyaXB0I3VzaW5nLXRoZS10cmFja2VyLW9iamVjdFxyXG4gICAgICAgKlxyXG4gICAgICAgKiBAcHJvcGVydHkgY2F0ZWdvcnlcclxuICAgICAgICogQHByb3BlcnR5IGFjdGlvblxyXG4gICAgICAgKiBAcHJvcGVydHkgbmFtZSAob3B0aW9uYWwsIHJlY29tbWVuZGVkKVxyXG4gICAgICAgKiBAcHJvcGVydHkgdmFsdWUgKG9wdGlvbmFsKVxyXG4gICAgICAgKi9cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICAvLyBQQVEgcmVxdWlyZXMgdGhhdCBldmVudFZhbHVlIGJlIGFuIGludGVnZXIsIHNlZTogaHR0cDovL21hdG9tby5vcmcvZG9jcy9ldmVudC10cmFja2luZ1xyXG4gICAgICAgIGlmICgocHJvcGVydGllcyBhcyBUcmFja0V2ZW50TWF0b21vUHJvcGVydGllcykudmFsdWUpIHtcclxuICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KChwcm9wZXJ0aWVzIGFzIFRyYWNrRXZlbnRNYXRvbW9Qcm9wZXJ0aWVzKS52YWx1ZSBhcyBhbnksIDEwKTtcclxuICAgICAgICAgIChwcm9wZXJ0aWVzIGFzIFRyYWNrRXZlbnRNYXRvbW9Qcm9wZXJ0aWVzKS52YWx1ZSA9IGlzTmFOKHBhcnNlZCkgPyAwIDogcGFyc2VkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGFyYW1zID0gW1xyXG4gICAgICAgICAgJ3RyYWNrRXZlbnQnLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tFdmVudE1hdG9tb1Byb3BlcnRpZXMpLmNhdGVnb3J5LFxyXG4gICAgICAgICAgYWN0aW9uLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tFdmVudE1hdG9tb1Byb3BlcnRpZXMpLm5hbWUgfHxcclxuICAgICAgICAgICAgKHByb3BlcnRpZXMgYXMgVHJhY2tFdmVudE1hdG9tb1Byb3BlcnRpZXMpLmxhYmVsLCAvLyBDaGFuZ2VkIGluIGZhdm91ciBvZiBNYXRvbW8gZG9jdW1lbnRhdGlvbi4gQWRkZWQgZmFsbGJhY2sgc28gaXQncyBiYWNrd2FyZHMgY29tcGF0aWJsZS5cclxuICAgICAgICAgIChwcm9wZXJ0aWVzIGFzIFRyYWNrRXZlbnRNYXRvbW9Qcm9wZXJ0aWVzKS52YWx1ZSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgdHJ5IHtcclxuICAgICAgX3BhcS5wdXNoKHBhcmFtcyk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBSZWZlcmVuY2VFcnJvcikpIHtcclxuICAgICAgICB0aHJvdyBlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRVc2VybmFtZSh1c2VySWQ6IHN0cmluZyB8IGJvb2xlYW4pIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIF9wYXEucHVzaChbJ3NldFVzZXJJZCcsIHVzZXJJZF0pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBpZiAoIShlIGluc3RhbmNlb2YgUmVmZXJlbmNlRXJyb3IpKSB7XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyBjdXN0b20gZGltZW5zaW9ucyBpZiBhdCBsZWFzdCBvbmUgcHJvcGVydHkgaGFzIHRoZSBrZXkgXCJkaW1lbnNpb248bj5cIixcclxuICAgKiBlLmcuIGRpbWVuc2lvbjEwLiBJZiB0aGVyZSBhcmUgY3VzdG9tIGRpbWVuc2lvbnMsIGFueSBvdGhlciBwcm9wZXJ0eSBpcyBpZ25vcmVkLlxyXG4gICAqXHJcbiAgICogSWYgdGhlcmUgYXJlIG5vIGN1c3RvbSBkaW1lbnNpb25zIGluIHRoZSBnaXZlbiBwcm9wZXJ0aWVzIG9iamVjdCwgdGhlIHByb3BlcnRpZXNcclxuICAgKiBvYmplY3QgaXMgc2F2ZWQgYXMgYSBjdXN0b20gdmFyaWFibGUuXHJcbiAgICpcclxuICAgKiBJZiBpbiBkb3VidCwgcHJlZmVyIGN1c3RvbSBkaW1lbnNpb25zLlxyXG4gICAqIEBsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9kb2NzL2N1c3RvbS12YXJpYWJsZXMvXHJcbiAgICovXHJcbiAgc2V0VXNlclByb3BlcnRpZXMocHJvcGVydGllczogU2V0Q3VzdG9tVmFyaWFibGVNYXRvbW9Qcm9wZXJ0aWVzIHwgRGltZW5zaW9uc01hdG9tb1Byb3BlcnRpZXMpIHtcclxuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB0aGlzLnNldEN1c3RvbURpbWVuc2lvbnMocHJvcGVydGllcyk7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoZGltZW5zaW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBfcGFxLnB1c2goW1xyXG4gICAgICAgICAgJ3NldEN1c3RvbVZhcmlhYmxlJyxcclxuICAgICAgICAgIChwcm9wZXJ0aWVzIGFzIFNldEN1c3RvbVZhcmlhYmxlTWF0b21vUHJvcGVydGllcykuaW5kZXgsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBTZXRDdXN0b21WYXJpYWJsZU1hdG9tb1Byb3BlcnRpZXMpLm5hbWUsXHJcbiAgICAgICAgICAocHJvcGVydGllcyBhcyBTZXRDdXN0b21WYXJpYWJsZU1hdG9tb1Byb3BlcnRpZXMpLnZhbHVlLFxyXG4gICAgICAgICAgKHByb3BlcnRpZXMgYXMgU2V0Q3VzdG9tVmFyaWFibGVNYXRvbW9Qcm9wZXJ0aWVzKS5zY29wZSxcclxuICAgICAgICBdKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBpZiAoIShlIGluc3RhbmNlb2YgUmVmZXJlbmNlRXJyb3IpKSB7XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSWYgeW91IGNyZWF0ZWQgYSBjdXN0b20gdmFyaWFibGUgYW5kIHRoZW4gZGVjaWRlIHRvIHJlbW92ZSB0aGlzIHZhcmlhYmxlIGZyb21cclxuICAgKiBhIHZpc2l0IG9yIHBhZ2UgdmlldywgeW91IGNhbiB1c2UgZGVsZXRlQ3VzdG9tVmFyaWFibGUuXHJcbiAgICpcclxuICAgKiBAbGluayBodHRwczovL2RldmVsb3Blci5tYXRvbW8ub3JnL2d1aWRlcy90cmFja2luZy1qYXZhc2NyaXB0LWd1aWRlI2RlbGV0aW5nLWEtY3VzdG9tLXZhcmlhYmxlXHJcbiAgICovXHJcbiAgZGVsZXRlZFVzZXJQcm9wZXJ0aWVzKHByb3BlcnRpZXM6IERlbGV0ZUN1c3RvbVZhcmlhYmxlTWF0b21vUHJvcGVydGllcykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgX3BhcS5wdXNoKFsnZGVsZXRlQ3VzdG9tVmFyaWFibGUnLCBwcm9wZXJ0aWVzLmluZGV4LCBwcm9wZXJ0aWVzLnNjb3BlXSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGlmICghKGUgaW5zdGFuY2VvZiBSZWZlcmVuY2VFcnJvcikpIHtcclxuICAgICAgICB0aHJvdyBlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldEN1c3RvbURpbWVuc2lvbnMocHJvcGVydGllczogU2V0Q3VzdG9tVmFyaWFibGVNYXRvbW9Qcm9wZXJ0aWVzIHwgRGltZW5zaW9uc01hdG9tb1Byb3BlcnRpZXMpOiBzdHJpbmdbXSB7XHJcbiAgICBjb25zdCBkaW1lbnNpb25SZWdleDogUmVnRXhwID0gL2RpbWVuc2lvblsxLTldXFxkKi87XHJcbiAgICBjb25zdCBkaW1lbnNpb25zID0gT2JqZWN0LmtleXMocHJvcGVydGllcykuZmlsdGVyKGtleSA9PiBkaW1lbnNpb25SZWdleC5leGVjKGtleSkpO1xyXG4gICAgZGltZW5zaW9ucy5mb3JFYWNoKGRpbWVuc2lvbiA9PiB7XHJcbiAgICAgIGNvbnN0IG51bWJlciA9IE51bWJlcihkaW1lbnNpb24uc3Vic3RyKDkpKTtcclxuICAgICAgX3BhcS5wdXNoKFsnc2V0Q3VzdG9tRGltZW5zaW9uJywgbnVtYmVyLCBwcm9wZXJ0aWVzW2RpbWVuc2lvbl1dKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRpbWVuc2lvbnM7XHJcbiAgfVxyXG59XHJcbiJdfQ==