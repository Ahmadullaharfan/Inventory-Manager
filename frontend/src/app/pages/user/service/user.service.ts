import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  role: 'admin' | 'manager' | 'user';
  avatar_url: string | null;
  email_verified: boolean;
  status: string;
  last_login_at: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Reactive, signal-based resource.
   * The arrow function makes the URL reactive — if you later read a signal
   * inside it (e.g. a filter, search term, user id), the resource auto-refetches.
   */
  public readonly usersResource = httpResource<User[]>(
    () => `${this.apiUrl}/users`
  );

  /**
   * Optional: reload helper for after create/update/delete operations.
   */
  public reloadUsers(): void {
    this.usersResource.reload();
  }
}