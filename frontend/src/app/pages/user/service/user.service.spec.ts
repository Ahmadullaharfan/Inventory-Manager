import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../module/user.module';
describe('UserService', () => {
  let service: UserService; let http: HttpTestingController;
  const canViewUsers = signal(false);
  beforeEach(() => { canViewUsers.set(false); TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), {provide: AuthService, useValue: {canViewUsers}}] }); service = TestBed.inject(UserService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());
  it('unwraps the user API envelope and preserves numeric IDs', () => { let result: User | undefined; service.get(12).subscribe(user => result = user); http.expectOne('/api/users/12').flush({data: {id: 12, phone_number: '+93 700'}}); expect(result?.id).toBe(12); expect(result?.phone_number).toBe('+93 700'); });
  it('uses method spoofing for multipart profile updates', () => { const form = new FormData(); form.append('first_name', 'Amina'); service.update(12, form).subscribe(); const request = http.expectOne('/api/users/12?_method=PUT'); expect(request.request.method).toBe('POST'); expect(request.request.body).toBe(form); request.flush({data: {id:12}}); });
  it('uses PUT for partial JSON updates', () => { service.update(12, {bio: 'Updated'}).subscribe(); const request = http.expectOne('/api/users/12'); expect(request.request.method).toBe('PUT'); expect(request.request.body).toEqual({bio:'Updated'}); request.flush({data: {id:12}}); });
  it('does not load the administration list for ordinary users', () => { TestBed.tick(); http.expectNone('/api/users'); expect(service.usersResource.value()).toEqual([]); });
  it('keeps false notification values', () => { service.preferences(12, {email_notifications:false, realtime_enabled:true, team_alerts:false}).subscribe(); const request = http.expectOne('/api/users/12/notification-preferences'); expect(request.request.body.email_notifications).toBeFalse(); request.flush({data:request.request.body}); });
});
