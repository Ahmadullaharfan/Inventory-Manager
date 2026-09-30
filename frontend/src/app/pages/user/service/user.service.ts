import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../module/user.module';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

 
  public readonly usersResource = httpResource<User[]>(
    () => `${this.apiUrl}/users`
  );

  update(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public reloadUsers(): void {
    this.usersResource.reload();
  }
}