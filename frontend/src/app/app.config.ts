import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { LayoutModule } from 'app/layout/layout.module';
import { coreConfig } from 'app/app-config';
import { PagesModule } from 'app/main/pages/pages.module';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      BrowserAnimationsModule,
      TranslateModule.forRoot(),
      NgbModule,
      CoreModule.forRoot(coreConfig),
      CoreCommonModule,
      CoreSidebarModule,
      CoreThemeCustomizerModule,
      LayoutModule,
      PagesModule
    )
  ]
};
