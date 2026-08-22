import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { coreConfig } from 'app/app-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ProductModule } from './main/features/Products/product.module';

const appRoutes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        // Register Toastr early so its providers (ToastConfig) are available
        // for any root services created during bootstrap.
        ToastrModule.forRoot(),
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled'
        }),
        TranslateModule.forRoot(),
        //NgBootstrap
        NgbModule,
        // Core modules
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        CoreThemeCustomizerModule,
        // App modules
        LayoutModule,
        ProductModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
