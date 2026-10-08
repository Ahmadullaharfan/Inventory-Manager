import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { LocalizationService } from './localization.service';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const api = new URL(environment.apiUrl, window.location.origin);
  const url = new URL(request.url, window.location.origin);
  const backend = url.origin === api.origin && (url.pathname.startsWith(api.pathname + '/') || url.pathname === '/sanctum/csrf-cookie');
  if (!backend) return next(request);
  const auth = inject(AuthService);
  const cookie = document.cookie.split('; ').find(value => value.startsWith('XSRF-TOKEN='));
  const headers: Record<string, string> = { Accept: 'application/json', 'Accept-Language': inject(LocalizationService).language() };
  if (cookie && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) headers['X-XSRF-TOKEN'] = decodeURIComponent(cookie.slice(11));
  return next(request.clone({ withCredentials: true, setHeaders: headers })).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401 && auth.user()) auth.clearSession();
    return throwError(() => error);
  }));
};
