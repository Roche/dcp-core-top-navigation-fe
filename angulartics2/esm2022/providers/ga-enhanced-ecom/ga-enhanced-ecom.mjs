import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class Angulartics2GoogleAnalyticsEnhancedEcommerce {
    /**
     * Add impression in GA enhanced ecommerce tracking
     * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce#measuring-activities
     */
    ecAddImpression(properties) {
        ga('ec:addImpression', properties);
    }
    /**
     * Add product in GA enhanced ecommerce tracking
     * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce
     */
    ecAddProduct(product) {
        ga('ec:addProduct', product);
    }
    /**
     * Set action in GA enhanced ecommerce tracking
     * @link https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce
     */
    ecSetAction(action, properties) {
        ga('ec:setAction', action, properties);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleAnalyticsEnhancedEcommerce, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleAnalyticsEnhancedEcommerce, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2GoogleAnalyticsEnhancedEcommerce, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2EtZW5oYW5jZWQtZWNvbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcHJvdmlkZXJzL2dhLWVuaGFuY2VkLWVjb20vZ2EtZW5oYW5jZWQtZWNvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQVczQyxNQUFNLE9BQU8sNENBQTRDO0lBQ3ZEOzs7T0FHRztJQUNILGVBQWUsQ0FBQyxVQUF3RDtRQUN0RSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVEOzs7T0FHRztJQUNILFlBQVksQ0FBQyxPQUFrRDtRQUM3RCxFQUFFLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7O09BR0c7SUFDSCxXQUFXLENBQ1QsTUFBNEIsRUFDNUIsVUFBb0Q7UUFFcEQsRUFBRSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDekMsQ0FBQzt3R0ExQlUsNENBQTRDOzRHQUE1Qyw0Q0FBNEMsY0FEL0IsTUFBTTs7NEZBQ25CLDRDQUE0QztrQkFEeEQsVUFBVTttQkFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7XHJcbiAgR2FFbmhhbmNlZEVjb21BY3Rpb24sXHJcbiAgR2FFbmhhbmNlZEVjb21BY3Rpb25GaWVsZE9iamVjdCxcclxuICBHYUVuaGFuY2VkRWNvbUltcHJlc3Npb25GaWVsZE9iamVjdCxcclxuICBHYUVuaGFuY2VkRWNvbVByb2R1Y3RGaWVsZE9iamVjdCxcclxufSBmcm9tICcuL2dhLWVuaGFuY2VkLWVjb20tb3B0aW9ucyc7XHJcblxyXG5kZWNsYXJlIHZhciBnYTogVW5pdmVyc2FsQW5hbHl0aWNzLmdhO1xyXG5cclxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJ0aWNzMkdvb2dsZUFuYWx5dGljc0VuaGFuY2VkRWNvbW1lcmNlIHtcclxuICAvKipcclxuICAgKiBBZGQgaW1wcmVzc2lvbiBpbiBHQSBlbmhhbmNlZCBlY29tbWVyY2UgdHJhY2tpbmdcclxuICAgKiBAbGluayBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9hbmFseXRpY3MvZGV2Z3VpZGVzL2NvbGxlY3Rpb24vYW5hbHl0aWNzanMvZW5oYW5jZWQtZWNvbW1lcmNlI21lYXN1cmluZy1hY3Rpdml0aWVzXHJcbiAgICovXHJcbiAgZWNBZGRJbXByZXNzaW9uKHByb3BlcnRpZXM6IFBhcnRpYWw8R2FFbmhhbmNlZEVjb21JbXByZXNzaW9uRmllbGRPYmplY3Q+KSB7XHJcbiAgICBnYSgnZWM6YWRkSW1wcmVzc2lvbicsIHByb3BlcnRpZXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQWRkIHByb2R1Y3QgaW4gR0EgZW5oYW5jZWQgZWNvbW1lcmNlIHRyYWNraW5nXHJcbiAgICogQGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vYW5hbHl0aWNzL2Rldmd1aWRlcy9jb2xsZWN0aW9uL2FuYWx5dGljc2pzL2Vjb21tZXJjZVxyXG4gICAqL1xyXG4gIGVjQWRkUHJvZHVjdChwcm9kdWN0OiBQYXJ0aWFsPEdhRW5oYW5jZWRFY29tUHJvZHVjdEZpZWxkT2JqZWN0Pikge1xyXG4gICAgZ2EoJ2VjOmFkZFByb2R1Y3QnLCBwcm9kdWN0KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldCBhY3Rpb24gaW4gR0EgZW5oYW5jZWQgZWNvbW1lcmNlIHRyYWNraW5nXHJcbiAgICogQGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vYW5hbHl0aWNzL2Rldmd1aWRlcy9jb2xsZWN0aW9uL2FuYWx5dGljc2pzL2Vjb21tZXJjZVxyXG4gICAqL1xyXG4gIGVjU2V0QWN0aW9uKFxyXG4gICAgYWN0aW9uOiBHYUVuaGFuY2VkRWNvbUFjdGlvbixcclxuICAgIHByb3BlcnRpZXM6IFBhcnRpYWw8R2FFbmhhbmNlZEVjb21BY3Rpb25GaWVsZE9iamVjdD5cclxuICApIHtcclxuICAgIGdhKCdlYzpzZXRBY3Rpb24nLCBhY3Rpb24sIHByb3BlcnRpZXMpO1xyXG4gIH1cclxufVxyXG4iXX0=