import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
export const authGuard: CanActivateFn = (_route, state) => inject(AuthService).user() ? true : inject(Router).createUrlTree(['/signin'], { queryParams: { returnUrl: state.url } });
export const userAdminGuard: CanActivateFn = () => inject(AuthService).canViewUsers() ? true : inject(Router).createUrlTree(['/profile']);
