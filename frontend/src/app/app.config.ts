import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy } from '@angular/router';
import { LocalizedTitleStrategy } from './shared/services/localized-title.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { AuthService } from './shared/services/auth.service';
import { authInterceptor } from './shared/services/auth.interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LocalizedPaginatorIntl } from './shared/services/localized-paginator.service';
import { LocalizationService } from './shared/services/localization.service';
export const appConfig: ApplicationConfig = {
  providers: [{ provide: TitleStrategy, useClass: LocalizedTitleStrategy }, { provide: MatPaginatorIntl, useClass: LocalizedPaginatorIntl }, provideAppInitializer(() => { inject(LocalizationService); }), provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])), provideAppInitializer(() => firstValueFrom(inject(AuthService).restoreSession()))],
};
