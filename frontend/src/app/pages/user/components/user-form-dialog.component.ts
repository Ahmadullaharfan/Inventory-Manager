import { LocalizePipe } from '../../../shared/pipe/localize.pipe';
import { Component, inject, Inject, OnDestroy, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { SelectComponent } from '../../../shared/components/form/select/select.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService, apiError } from '../service/user.service';
import { defaultPreferences, User, UserRole, userRoleDetails } from '../module/user.module';
@Component({ selector: 'app-user-form-dialog', standalone: true, imports: [LocalizePipe, ReactiveFormsModule, MatDialogModule, InputFieldComponent, SelectComponent, ButtonComponent], templateUrl: './user-form-dialog.component.html' })
export class UserFormDialogComponent implements OnDestroy {
  readonly auth = inject(AuthService);
  private users = inject(UserService);
  private fb = inject(FormBuilder);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly tab = signal('Personal');
  readonly tabs = ['Personal', 'Addresses', 'Social links', 'Notifications'];
  readonly isEdit: boolean;
  readonly form: FormGroup;
  readonly roles = (Object.keys(userRoleDetails) as UserRole[]).map(value => ({ value, ...userRoleDetails[value] }));
  readonly statuses = [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'suspended', label: 'Suspended' }];
  readonly socialPlatforms = [{ value: 'facebook', label: 'Facebook' }, { value: 'x', label: 'X' }, { value: 'linkedin', label: 'LinkedIn' }, { value: 'instagram', label: 'Instagram' }, { value: 'github', label: 'GitHub' }, { value: 'website', label: 'Website' }];
  avatar: File | null = null;
  avatarPreview: string | null;
  removeAvatar = false;
  private objectUrl: string | null = null;
  constructor(public dialogRef: MatDialogRef<UserFormDialogComponent, User | undefined>, @Inject(MAT_DIALOG_DATA) public data: { user?: User; initialTab?: string }) {
    const user = data?.user;
    const preferences = user?.notification_preferences ?? defaultPreferences();
    this.isEdit = !!user;
    this.tab.set(data?.initialTab ?? 'Personal');
    this.avatarPreview = user?.avatar_url ?? null;
    this.form = this.fb.group({ first_name: [user?.first_name ?? '', [Validators.required, Validators.maxLength(100)]], last_name: [user?.last_name ?? '', [Validators.required, Validators.maxLength(100)]], email: [user?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(255)]], phone_number: [user?.phone_number ?? '', Validators.maxLength(30)], bio: [user?.bio ?? '', Validators.maxLength(5000)], role: [user?.role ?? 'user', Validators.required], status: [user?.status ?? 'active', Validators.required], email_verified: [user?.email_verified ?? false], password: ['', this.isEdit ? [Validators.minLength(8), Validators.maxLength(255)] : [Validators.required, Validators.minLength(8), Validators.maxLength(255)]], password_confirmation: [''], addresses: this.fb.array([]), social_links: this.fb.array([]), notification_preferences: this.fb.group({ realtime_enabled: [preferences.realtime_enabled], team_alerts: [preferences.team_alerts], email_notifications: [preferences.email_notifications] }) });
    for (const address of user?.addresses ?? []) this.addresses.push(this.fb.group({ country: [address.country ?? '', Validators.maxLength(100)], city_state: [address.city_state ?? '', Validators.maxLength(150)], postal_code: [address.postal_code ?? '', Validators.maxLength(20)], tax_id: [address.tax_id ?? '', Validators.maxLength(50)], is_primary: [address.is_primary] }));
    for (const link of user?.social_links ?? []) this.socials.push(this.fb.group({ platform: [link.platform, [Validators.required, Validators.maxLength(50)]], url: [link.url, [Validators.required, Validators.pattern(/^https?:\/\/.+/), Validators.maxLength(500)]] }));
  }
  get roleDescription(): string { return this.roles.find(role => role.value === this.value('role'))?.description ?? ''; }
  get addresses(): FormArray { return this.form.get('addresses') as FormArray; }
  get socials(): FormArray { return this.form.get('social_links') as FormArray; }
  value(key: string): string { return this.form.get(key)?.value ?? ''; }
  set(key: string, value: string | number) { const control = this.form.get(key); control?.setValue(value); control?.markAsTouched(); }
  fieldError(key: string): string { const control = this.form.get(key); return control?.touched && control.invalid ? 'Enter a valid value for this field.' : ''; }
  addAddress() { if (this.addresses.length < 10) this.addresses.push(this.fb.group({ country: ['', Validators.maxLength(100)], city_state: ['', Validators.maxLength(150)], postal_code: ['', Validators.maxLength(20)], tax_id: ['', Validators.maxLength(50)], is_primary: [this.addresses.length === 0] })); }
  removeAddress(index: number) { const wasPrimary = this.addresses.at(index).value.is_primary; this.addresses.removeAt(index); if (wasPrimary && this.addresses.length) this.primaryAddress(0); }
  primaryAddress(index: number) { this.addresses.controls.forEach((control, i) => control.get('is_primary')?.setValue(i === index)); }
  addSocial() { if (this.socials.length < 10) this.socials.push(this.fb.group({ platform: ['', Validators.required], url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/), Validators.maxLength(500)]] })); }
  pickAvatar(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { this.error.set('Choose a JPEG, PNG or WebP image under 2 MB.'); return; }
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(file); this.avatarPreview = this.objectUrl; this.avatar = file; this.removeAvatar = false; this.error.set('');
  }
  clearAvatar() { if (this.objectUrl) URL.revokeObjectURL(this.objectUrl); this.objectUrl = null; this.avatar = null; this.avatarPreview = null; this.removeAvatar = true; }
  save() {
    if (this.busy()) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) { this.error.set('Check the fields in each tab before saving.'); return; }
    const values = this.form.getRawValue();
    if (values.password && values.password !== values.password_confirmation) { this.error.set('The password confirmation does not match.'); return; }
    const payload = new FormData();
    for (const key of ['first_name', 'last_name', 'email', 'phone_number', 'bio']) payload.append(key, values[key]);
    if (this.auth.isAdmin()) { for (const key of ['role', 'status', 'email_verified']) payload.append(key, String(values[key])); }
    if (values.password && (!this.isEdit || this.data.user?.id !== this.auth.user()?.id)) { payload.append('password', values.password); payload.append('password_confirmation', values.password_confirmation); }
    for (const key of ['addresses', 'social_links', 'notification_preferences']) payload.append(key, JSON.stringify(values[key]));
    if (this.avatar) payload.append('avatar', this.avatar);
    payload.append('remove_avatar', String(this.removeAvatar));
    this.busy.set(true); this.error.set('');
    const request = this.data.user ? this.users.update(this.data.user.id, payload) : this.users.create(payload);
    request.subscribe({ next: user => { this.busy.set(false); this.auth.updateCurrent(user); this.dialogRef.close(user); }, error: error => { this.busy.set(false); this.error.set(apiError(error)); } });
  }
  close() { if (!this.busy()) this.dialogRef.close(); }
  ngOnDestroy() { if (this.objectUrl) URL.revokeObjectURL(this.objectUrl); }
}
