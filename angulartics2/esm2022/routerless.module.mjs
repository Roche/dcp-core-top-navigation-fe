import { NgModule } from '@angular/core';
import { ANGULARTICS2_TOKEN } from './angulartics2-token';
import { Angulartics2OnModule } from './angulartics2On';
import { Angulartics2 } from './angulartics2-core';
import { RouterlessTracking } from './routerless';
import * as i0 from "@angular/core";
export class Angulartics2RouterlessModule {
    static forRoot(settings = {}) {
        return {
            ngModule: Angulartics2RouterlessModule,
            providers: [
                { provide: ANGULARTICS2_TOKEN, useValue: { settings } },
                RouterlessTracking,
                Angulartics2,
            ],
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2RouterlessModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2RouterlessModule, imports: [Angulartics2OnModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2RouterlessModule, imports: [Angulartics2OnModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2RouterlessModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [Angulartics2OnModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVybGVzcy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3JvdXRlcmxlc3MubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTlELE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXhELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxjQUFjLENBQUM7O0FBS2hELE1BQU0sT0FBTyw0QkFBNEI7SUFDdkMsTUFBTSxDQUFDLE9BQU8sQ0FDWixXQUEwQyxFQUFFO1FBRTVDLE9BQU87WUFDTCxRQUFRLEVBQUUsNEJBQTRCO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRTtnQkFDdkQsa0JBQWtCO2dCQUNsQixZQUFZO2FBQ2I7U0FDRixDQUFDO0lBQ0osQ0FBQzt3R0FaVSw0QkFBNEI7eUdBQTVCLDRCQUE0QixZQUY3QixvQkFBb0I7eUdBRW5CLDRCQUE0QixZQUY3QixvQkFBb0I7OzRGQUVuQiw0QkFBNEI7a0JBSHhDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7aUJBQ2hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7QU5HVUxBUlRJQ1MyX1RPS0VOfSBmcm9tICcuL2FuZ3VsYXJ0aWNzMi10b2tlbic7XHJcbmltcG9ydCB7QW5ndWxhcnRpY3MyU2V0dGluZ3N9IGZyb20gJy4vYW5ndWxhcnRpY3MyLWNvbmZpZyc7XHJcbmltcG9ydCB7QW5ndWxhcnRpY3MyT25Nb2R1bGV9IGZyb20gJy4vYW5ndWxhcnRpY3MyT24nO1xyXG5pbXBvcnQge0FuZ3VsYXJ0aWNzMn0gZnJvbSAnLi9hbmd1bGFydGljczItY29yZSc7XHJcbmltcG9ydCB7Um91dGVybGVzc1RyYWNraW5nfSBmcm9tICcuL3JvdXRlcmxlc3MnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbQW5ndWxhcnRpY3MyT25Nb2R1bGVdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhcnRpY3MyUm91dGVybGVzc01vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoXHJcbiAgICBzZXR0aW5nczogUGFydGlhbDxBbmd1bGFydGljczJTZXR0aW5ncz4gPSB7fVxyXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8QW5ndWxhcnRpY3MyUm91dGVybGVzc01vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEFuZ3VsYXJ0aWNzMlJvdXRlcmxlc3NNb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIHsgcHJvdmlkZTogQU5HVUxBUlRJQ1MyX1RPS0VOLCB1c2VWYWx1ZTogeyBzZXR0aW5ncyB9IH0sXHJcbiAgICAgICAgUm91dGVybGVzc1RyYWNraW5nLFxyXG4gICAgICAgIEFuZ3VsYXJ0aWNzMixcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==