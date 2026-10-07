import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../shared/services/auth.service';
import { ApiResponse, AuditPage, NotificationPreferences, User, UserDevice } from '../module/user.module';

export function apiError(error: HttpErrorResponse): string {
  const errors = error.error?.errors as Record<string, string[]> | undefined;
  return errors ? Object.values(errors).flat().join(' ') : error.error?.message || (error.status === 0 ? 'Cannot reach the server. Please try again.' : 'The request failed. Please try again.');
}
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private api = environment.apiUrl + '/users';
  readonly usersResource = httpResource<User[]>(() => this.auth.canViewUsers() ? this.api : undefined, { parse: value => (value as ApiResponse<User[]>).data, defaultValue: [] });
  get(id: number) { return this.http.get<ApiResponse<User>>(this.api + '/' + id).pipe(map(response => response.data)); }
  create(data: FormData) { return this.http.post<ApiResponse<User>>(this.api, data).pipe(map(response => response.data)); }
  update(id: number, data: Partial<User> | FormData) {
    const request = data instanceof FormData ? this.http.post<ApiResponse<User>>(this.api + '/' + id + '?_method=PUT', data) : this.http.put<ApiResponse<User>>(this.api + '/' + id, data);
    return request.pipe(map(response => response.data));
  }
  delete(id: number) { return this.http.delete<void>(this.api + '/' + id); }
  reloadUsers() { this.usersResource.reload(); }
  preferences(id: number, data: NotificationPreferences) { return this.http.put<ApiResponse<NotificationPreferences>>(this.api + '/' + id + '/notification-preferences', data).pipe(map(response => response.data)); }
  devices(id: number) { return this.http.get<ApiResponse<UserDevice[]>>(this.api + '/' + id + '/devices').pipe(map(response => response.data)); }
  revokeDevice(id: number, device: number) { return this.http.delete<void>(this.api + '/' + id + '/devices/' + device); }
  revokeAll(id: number) { return this.http.delete<void>(this.api + '/' + id + '/devices'); }
  audit(id: number, page = 1) { return this.http.get<AuditPage>(this.api + '/' + id + '/audit-logs', { params: { page } }); }
  setupTwoFactor(id: number, password: string) { return this.http.post<ApiResponse<{secret: string; uri: string}>>(this.api + '/' + id + '/two-factor/setup', { current_password: password }).pipe(map(response => response.data)); }
  confirmTwoFactor(id: number, code: string) { return this.http.post<ApiResponse<{recovery_codes: string[]}>>(this.api + '/' + id + '/two-factor/confirm', { code }).pipe(map(response => response.data)); }
  regenerateCodes(id: number, password: string, code: string) { return this.http.post<ApiResponse<{recovery_codes: string[]}>>(this.api + '/' + id + '/two-factor/recovery-codes', { current_password: password, code }).pipe(map(response => response.data)); }
  disableTwoFactor(id: number, password: string, code: string) { return this.http.delete<void>(this.api + '/' + id + '/two-factor', { body: { current_password: password, code } }); }
  deleteAccount(id: number, current_password: string, code: string) { return this.http.delete<void>(this.api + '/' + id + '/account', { body: { current_password, code } }); }
  changePassword(id: number, current_password: string, password: string, password_confirmation: string) { return this.http.put<ApiResponse<User>>(this.api + '/' + id, { current_password, password, password_confirmation }).pipe(map(response => response.data)); }
}
