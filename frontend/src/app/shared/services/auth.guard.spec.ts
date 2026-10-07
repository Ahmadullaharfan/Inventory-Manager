import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { authGuard, userAdminGuard } from './auth.guard';
describe('User route guards', () => {
  const user=signal<{id:number} | null>(null); const canViewUsers=signal(false);
  beforeEach(()=>{user.set(null);canViewUsers.set(false);TestBed.configureTestingModule({providers:[provideRouter([]),{provide:AuthService,useValue:{user,canViewUsers}}]});});
  it('redirects guests to sign-in with their original destination',()=>{const result=TestBed.runInInjectionContext(()=>authGuard({} as ActivatedRouteSnapshot,{url:'/users/12'} as RouterStateSnapshot)) as UrlTree;expect(TestBed.inject(Router).serializeUrl(result)).toBe('/signin?returnUrl=%2Fusers%2F12');});
  it('allows authenticated users through the account guard',()=>{user.set({id:12});expect(TestBed.runInInjectionContext(()=>authGuard({} as ActivatedRouteSnapshot,{} as RouterStateSnapshot))).toBeTrue();});
  it('hides administration from ordinary users',()=>{const result=TestBed.runInInjectionContext(()=>userAdminGuard({} as ActivatedRouteSnapshot,{} as RouterStateSnapshot)) as UrlTree;expect(TestBed.inject(Router).serializeUrl(result)).toBe('/profile');canViewUsers.set(true);expect(TestBed.runInInjectionContext(()=>userAdminGuard({} as ActivatedRouteSnapshot,{} as RouterStateSnapshot))).toBeTrue();});
});
