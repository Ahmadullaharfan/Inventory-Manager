import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, User } from '../../pages/user/module/user.module';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  readonly user = signal<User | null>(null);
  readonly isAdmin = computed(() => this.user()?.role === 'admin');
  readonly canViewUsers = computed(() => ['admin', 'manager'].includes(this.user()?.role ?? ''));
  private api = environment.apiUrl;

  restoreSession() {
    return this.http.get<ApiResponse<User>>(this.api + '/auth/me').pipe(
      map(response => response.data), tap(user => this.user.set(user)),
      catchError(() => { this.user.set(null); return of(null); }),
    );
  }
  private csrf() { return this.http.get(this.api.replace(/\/api\/?$/, '') + '/sanctum/csrf-cookie'); }
  login(credentials: { email: string; password: string; remember: boolean; code?: string }) {
    return this.csrf().pipe(switchMap(() => this.http.post<ApiResponse<User>>(this.api + '/auth/login', credentials)), map(response => response.data), tap(user => this.user.set(user)));
  }
  register(details: { first_name: string; last_name: string; email: string; password: string; password_confirmation: string }) {
    return this.csrf().pipe(switchMap(() => this.http.post<ApiResponse<User>>(this.api + '/auth/register', details)), map(response => response.data), tap(user => this.user.set(user)));
  }
  logout() { return this.http.post<void>(this.api + '/auth/logout', {}).pipe(tap(() => this.clearSession())); }
  clearSession() { this.user.set(null); void this.router.navigate(['/signin']); }
  updateCurrent(user: User) { if (this.user()?.id === user.id) this.user.set(user); }
}
