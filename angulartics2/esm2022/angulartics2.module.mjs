import { NgModule } from '@angular/core';
import { AngularRouterTracking } from './angular-router';
import { Angulartics2 } from './angulartics2-core';
import { ANGULARTICS2_TOKEN } from './angulartics2-token';
import { Angulartics2On, Angulartics2OnModule } from './angulartics2On';
import { RouterlessTracking } from './routerless';
import * as i0 from "@angular/core";
export class Angulartics2Module {
    static forRoot(settings = {}) {
        return {
            ngModule: Angulartics2Module,
            providers: [
                { provide: ANGULARTICS2_TOKEN, useValue: { settings } },
                { provide: RouterlessTracking, useClass: AngularRouterTracking },
                Angulartics2,
            ],
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Module, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Module, imports: [Angulartics2OnModule], exports: [Angulartics2On] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Module, imports: [Angulartics2OnModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: Angulartics2Module, decorators: [{
            type: NgModule,
            args: [{
                    imports: [Angulartics2OnModule],
                    exports: [Angulartics2On],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhcnRpY3MyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvYW5ndWxhcnRpY3MyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUV6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGNBQWMsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGNBQWMsQ0FBQzs7QUFNbEQsTUFBTSxPQUFPLGtCQUFrQjtJQUM3QixNQUFNLENBQUMsT0FBTyxDQUNaLFdBQTBDLEVBQUU7UUFFNUMsT0FBTztZQUNMLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsU0FBUyxFQUFFO2dCQUNULEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFO2dCQUN2RCxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUscUJBQXFCLEVBQUU7Z0JBQ2hFLFlBQVk7YUFDYjtTQUNGLENBQUM7SUFDSixDQUFDO3dHQVpVLGtCQUFrQjt5R0FBbEIsa0JBQWtCLFlBSG5CLG9CQUFvQixhQUNwQixjQUFjO3lHQUViLGtCQUFrQixZQUhuQixvQkFBb0I7OzRGQUduQixrQkFBa0I7a0JBSjlCLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7b0JBQy9CLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQztpQkFDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQW5ndWxhclJvdXRlclRyYWNraW5nIH0gZnJvbSAnLi9hbmd1bGFyLXJvdXRlcic7XHJcbmltcG9ydCB7IEFuZ3VsYXJ0aWNzMlNldHRpbmdzIH0gZnJvbSAnLi9hbmd1bGFydGljczItY29uZmlnJztcclxuaW1wb3J0IHsgQW5ndWxhcnRpY3MyIH0gZnJvbSAnLi9hbmd1bGFydGljczItY29yZSc7XHJcbmltcG9ydCB7IEFOR1VMQVJUSUNTMl9UT0tFTiB9IGZyb20gJy4vYW5ndWxhcnRpY3MyLXRva2VuJztcclxuaW1wb3J0IHsgQW5ndWxhcnRpY3MyT24sIEFuZ3VsYXJ0aWNzMk9uTW9kdWxlIH0gZnJvbSAnLi9hbmd1bGFydGljczJPbic7XHJcbmltcG9ydCB7IFJvdXRlcmxlc3NUcmFja2luZyB9IGZyb20gJy4vcm91dGVybGVzcyc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtBbmd1bGFydGljczJPbk1vZHVsZV0sXHJcbiAgZXhwb3J0czogW0FuZ3VsYXJ0aWNzMk9uXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJ0aWNzMk1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoXHJcbiAgICBzZXR0aW5nczogUGFydGlhbDxBbmd1bGFydGljczJTZXR0aW5ncz4gPSB7fSxcclxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEFuZ3VsYXJ0aWNzMk1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEFuZ3VsYXJ0aWNzMk1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgeyBwcm92aWRlOiBBTkdVTEFSVElDUzJfVE9LRU4sIHVzZVZhbHVlOiB7IHNldHRpbmdzIH0gfSxcclxuICAgICAgICB7IHByb3ZpZGU6IFJvdXRlcmxlc3NUcmFja2luZywgdXNlQ2xhc3M6IEFuZ3VsYXJSb3V0ZXJUcmFja2luZyB9LFxyXG4gICAgICAgIEFuZ3VsYXJ0aWNzMixcclxuICAgICAgXSxcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbiJdfQ==