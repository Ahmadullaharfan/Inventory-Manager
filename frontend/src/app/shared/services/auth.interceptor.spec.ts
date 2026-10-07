import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
describe('Session HTTP interceptor',()=>{
  let http:HttpClient; let controller:HttpTestingController; const user=signal<{id:number} | null>(null);let clearSession:jasmine.Spy;
  beforeEach(()=>{user.set(null);clearSession=jasmine.createSpy();document.cookie='XSRF-TOKEN=csrf%2Btest; path=/';TestBed.configureTestingModule({providers:[provideHttpClient(withInterceptors([authInterceptor])),provideHttpClientTesting(),{provide:AuthService,useValue:{user,clearSession}}]});http=TestBed.inject(HttpClient);controller=TestBed.inject(HttpTestingController);});
  afterEach(()=>{controller.verify();document.cookie='XSRF-TOKEN=; Max-Age=0; path=/';});
  it('attaches credentials and the decoded CSRF cookie to backend writes',()=>{http.post('/api/users',{}).subscribe();const request=controller.expectOne('/api/users');expect(request.request.withCredentials).toBeTrue();expect(request.request.headers.get('X-XSRF-TOKEN')).toBe('csrf+test');expect(request.request.headers.get('Accept')).toBe('application/json');request.flush({});});
  it('does not leak credentials or CSRF headers to other origins',()=>{http.post('https://example.test/api/users',{}).subscribe();const request=controller.expectOne('https://example.test/api/users');expect(request.request.withCredentials).toBeFalse();expect(request.request.headers.has('X-XSRF-TOKEN')).toBeFalse();request.flush({});});
  it('ends the local session when the server revokes access',()=>{user.set({id:12});http.get('/api/users').subscribe({error:()=>{}});controller.expectOne('/api/users').flush({message:'Session ended'},{status:401,statusText:'Unauthorized'});expect(clearSession).toHaveBeenCalled();});
});
