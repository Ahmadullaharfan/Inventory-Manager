import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserFormDialogComponent } from './user-form-dialog.component';
import { UserService } from '../service/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../module/user.module';
const user: User = {id:12,first_name:'Amina',last_name:'Ahmad',email:'amina@example.test',phone_number:'+93',bio:null,role:'user',status:'active',avatar_url:null,email_verified:false,two_fa_enabled:false,last_login_at:null,created_at:null,addresses:[],social_links:[],notification_preferences:{email_notifications:false,team_alerts:false,realtime_enabled:true}};
describe('User form dialog', () => {
  let fixture: ComponentFixture<UserFormDialogComponent>; let component: UserFormDialogComponent;
  let users: jasmine.SpyObj<UserService>; let dialog: jasmine.SpyObj<MatDialogRef<UserFormDialogComponent>>;
  async function setup(edit = false, editUser: User = user) {
    users = jasmine.createSpyObj('UserService', ['create','update']); users.create.and.returnValue(of(user)); users.update.and.returnValue(of(user));
    dialog = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({imports:[UserFormDialogComponent],providers:[{provide:UserService,useValue:users},{provide:AuthService,useValue:{isAdmin:signal(true),user:signal({id:99}),updateCurrent:jasmine.createSpy()}},{provide:MAT_DIALOG_DATA,useValue:{user:edit ? editUser : undefined}},{provide:MatDialogRef,useValue:dialog}]}).compileComponents();
    fixture = TestBed.createComponent(UserFormDialogComponent); component=fixture.componentInstance; fixture.detectChanges();
  }
  it('creates a user and sends confirmed passwords in multipart data', async () => {
    await setup(); component.form.patchValue({first_name:'Amina',last_name:'Ahmad',email:'amina@example.test',password:'secure-password',password_confirmation:'secure-password'}); component.save();
    const payload = users.create.calls.mostRecent().args[0]; expect(payload.get('password')).toBe('secure-password'); expect(payload.get('password_confirmation')).toBe('secure-password'); expect(dialog.close).toHaveBeenCalledWith(user);
  });
  it('preserves numeric user IDs and false preferences while editing', async () => {
    await setup(true); component.save(); expect(users.update.calls.mostRecent().args[0]).toBe(12); const payload = users.update.calls.mostRecent().args[1] as FormData; expect(payload.has('password')).toBeFalse(); expect(JSON.parse(payload.get('notification_preferences') as string).email_notifications).toBeFalse();
  });
  it('sends only editable notification settings when the API includes database metadata', async () => {
    const savedUser = { ...user, notification_preferences: { ...user.notification_preferences!, id: 7, user_id: 12, created_at: '2026-10-08T00:00:00Z', updated_at: '2026-10-08T00:00:00Z' } };
    await setup(true, savedUser);
    component.save();
    const payload = users.update.calls.mostRecent().args[1] as FormData;
    expect(JSON.parse(payload.get('notification_preferences') as string)).toEqual({ realtime_enabled: true, team_alerts: false, email_notifications: false });
  });
  it('maintains one primary address when addresses are removed', async () => {
    await setup(); component.addAddress(); component.addAddress(); component.primaryAddress(1); expect(component.addresses.value.filter((value: {is_primary:boolean})=>value.is_primary).length).toBe(1); component.removeAddress(1); expect(component.addresses.at(0).value.is_primary).toBeTrue();
  });
  it('keeps the dialog open and displays server validation errors', async () => {
    await setup(true); users.update.and.returnValue(throwError(()=>new HttpErrorResponse({status:422,error:{errors:{email:['This email is already used.']}}}))); component.save(); fixture.detectChanges(); expect(component.busy()).toBeFalse(); expect(dialog.close).not.toHaveBeenCalled(); expect(fixture.nativeElement.textContent).toContain('This email is already used.');
  });
  it('rejects unmatched passwords before contacting the API', async () => {
    await setup(); component.form.patchValue({first_name:'Amina',last_name:'Ahmad',email:'amina@example.test',password:'secure-password',password_confirmation:'different'}); component.save(); expect(users.create).not.toHaveBeenCalled(); expect(component.error()).toContain('confirmation');
  });
});
