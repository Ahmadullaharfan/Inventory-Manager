import { LocalizationService } from '../../../shared/services/localization.service';
import { LocalizePipe, LocalizedDatePipe } from '../../../shared/pipe/localize.pipe';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PageBreadcrumbComponent } from '../../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { UserMetaCardComponent } from '../../../shared/components/user-profile/user-meta-card/user-meta-card.component';
import { UserAddressCardComponent } from '../../../shared/components/user-profile/user-address-card/user-address-card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ModalComponent } from '../../../shared/components/ui/modal/modal.component';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm_dialog/confirm-dialog.component';
import { AuthService } from '../../../shared/services/auth.service';
import { UserService, apiError } from '../service/user.service';
import { AuditPage, defaultPreferences, NotificationPreferences, User, UserDevice } from '../module/user.module';
import { UserFormDialogComponent } from '../components/user-form-dialog.component';
import { Observable } from 'rxjs';
type SecurityMode = '' | 'password' | 'setup' | 'confirm' | 'disable' | 'recovery' | 'codes' | 'delete';
@Component({ selector: 'app-profile', standalone: true, imports: [LocalizePipe, LocalizedDatePipe, PageBreadcrumbComponent, ComponentCardComponent, UserMetaCardComponent, UserAddressCardComponent, ButtonComponent, InputFieldComponent, ModalComponent], templateUrl: './profile.component.html' })
export class ProfileComponent {
  readonly localization = inject(LocalizationService);
  readonly auth = inject(AuthService);
  private users = inject(UserService);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  readonly profile = signal<User | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly busy = signal(false);
  readonly devices = signal<UserDevice[]>([]);
  readonly deviceError = signal('');
  readonly history = signal<AuditPage | null>(null);
  readonly auditError = signal('');
  readonly isOwn = computed(() => this.profile()?.id === this.auth.user()?.id);
  readonly canEdit = computed(() => this.isOwn() || this.auth.isAdmin());
  readonly mode = signal<SecurityMode>('');
  readonly securityError = signal('');
  readonly recoveryCodes = signal<string[]>([]);
  readonly recoveryText = computed(() => this.recoveryCodes().join('\n'));
  readonly setupSecret = signal('');
  readonly setupUri = signal('');
  currentPassword = ''; newPassword = ''; confirmPassword = ''; code = '';
  preferences: NotificationPreferences = defaultPreferences();
  readonly preferenceFields = [{ key: 'realtime_enabled' as const, label: 'Real-time notifications' }, { key: 'team_alerts' as const, label: 'Team alerts' }, { key: 'email_notifications' as const, label: 'Email notifications' }];
  constructor() { this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load()); }
  load() {
    const parameter = this.route.snapshot.paramMap.get('id');
    const id = parameter ? Number(parameter) : this.auth.user()?.id;
    if (!id || !Number.isSafeInteger(id)) { this.error.set('User not found.'); this.loading.set(false); return; }
    this.loading.set(true); this.error.set('');
    this.users.get(id).subscribe({ next: user => { this.profile.set(user); this.auth.updateCurrent(user); this.preferences = { ...(user.notification_preferences ?? defaultPreferences()) }; this.loading.set(false); if (this.canEdit()) this.refreshActivity(); }, error: error => { this.error.set(apiError(error, this.localization)); this.loading.set(false); } });
  }
  edit(initialTab = 'Personal') {
    const user = this.profile(); if (!user || !this.canEdit()) return;
    this.dialog.open(UserFormDialogComponent, { width: '760px', maxWidth: '95vw', disableClose: true, data: { user, initialTab } }).afterClosed().subscribe((saved?: User) => { if (saved) { this.load(); this.users.reloadUsers(); this.notify('Profile updated.'); } });
  }
  refreshActivity() { const user = this.profile(); if (!user) return; this.deviceError.set(''); this.users.devices(user.id).subscribe({ next: devices => this.devices.set(devices), error: error => this.deviceError.set(apiError(error, this.localization)) }); this.audit(1); }
  audit(page: number) { const user = this.profile(); if (!user) return; this.auditError.set(''); this.users.audit(user.id, page).subscribe({ next: history => this.history.set(history), error: error => this.auditError.set(apiError(error, this.localization)) }); }
  togglePreference(key: keyof NotificationPreferences, event: Event) { this.preferences = { ...this.preferences, [key]: (event.target as HTMLInputElement).checked }; }
  savePreferences() { const user = this.profile(); if (!user || this.busy()) return; this.busy.set(true); this.users.preferences(user.id, this.preferences).subscribe({ next: preferences => { this.preferences = preferences; this.profile.update(user => user ? { ...user, notification_preferences: preferences } : null); this.busy.set(false); this.notify('Notification preferences saved.'); this.audit(1); }, error: error => { this.busy.set(false); this.notify(apiError(error, this.localization)); } }); }
  revokeDevice(device: UserDevice) {
    const user = this.profile(); if (!user || this.busy() || device.revoked_at) return;
    this.dialog.open(ConfirmDialogComponent, { width: '420px', data: { title: 'Revoke device', message: device.is_current ? 'This will sign you out of this browser.' : 'This device will be signed out on its next request.', confirmText: 'Revoke', confirmColor: 'warn' } }).afterClosed().subscribe(confirmed => { if (confirmed) this.users.revokeDevice(user.id, device.id).subscribe({ next: () => { if (device.is_current) this.auth.clearSession(); else { this.refreshActivity(); this.notify('Device revoked.'); } }, error: error => this.notify(apiError(error, this.localization)) }); });
  }
  revokeAll() { const user = this.profile(); if (!user) return; this.dialog.open(ConfirmDialogComponent, { width: '420px', data: { title: 'Sign out all devices', message: this.isOwn() ? 'You will also be signed out of this browser.' : 'All sessions for this user will be revoked.', confirmText: 'Sign out all', confirmColor: 'warn' } }).afterClosed().subscribe(confirmed => { if (confirmed) this.users.revokeAll(user.id).subscribe({ next: () => { if (this.isOwn()) this.auth.clearSession(); else { this.refreshActivity(); this.notify('All devices signed out.'); } }, error: error => this.notify(apiError(error, this.localization)) }); }); }
  openSecurity(mode: SecurityMode) { this.mode.set(mode); this.securityError.set(''); this.currentPassword = ''; this.newPassword = ''; this.confirmPassword = ''; this.code = ''; this.recoveryCodes.set([]); this.setupSecret.set(''); this.setupUri.set(''); }
  closeSecurity() { if (!this.busy()) { this.mode.set(''); this.currentPassword = ''; this.newPassword = ''; this.confirmPassword = ''; this.code = ''; this.setupSecret.set(''); this.setupUri.set(''); this.recoveryCodes.set([]); } }
  submitSecurity() {
    const user = this.profile(); if (!user || !this.isOwn() || this.busy()) return;
    let request: Observable<unknown>;
    const mode = this.mode(); this.securityError.set('');
    if (mode !== 'confirm' && !this.currentPassword) { this.securityError.set('Enter your current password.'); return; }
    if (mode === 'password') {
      if (this.newPassword.length < 8 || this.newPassword !== this.confirmPassword) { this.securityError.set('Use at least 8 characters and matching password confirmation.'); return; }
      request = this.users.changePassword(user.id, this.currentPassword, this.newPassword, this.confirmPassword);
    } else if (mode === 'setup') request = this.users.setupTwoFactor(user.id, this.currentPassword);
    else if (mode === 'confirm') request = this.users.confirmTwoFactor(user.id, this.code);
    else if (mode === 'disable') request = this.users.disableTwoFactor(user.id, this.currentPassword, this.code);
    else if (mode === 'delete') request = this.users.deleteAccount(user.id, this.currentPassword, this.code);
    else if (mode === 'recovery') request = this.users.regenerateCodes(user.id, this.currentPassword, this.code);
    else return;
    this.busy.set(true);
    request.subscribe({ next: result => {
      this.busy.set(false);
      if (mode === 'setup') { const setup = result as {secret: string; uri: string}; this.setupSecret.set(setup.secret); this.setupUri.set(setup.uri); this.currentPassword = ''; this.mode.set('confirm'); }
      else if (mode === 'confirm' || mode === 'recovery') { this.recoveryCodes.set((result as {recovery_codes: string[]}).recovery_codes); this.mode.set('codes'); this.currentPassword = ''; this.code = ''; this.load(); }
      else if (mode === 'delete') { this.closeSecurity(); this.auth.clearSession(); }
      else { this.closeSecurity(); this.load(); this.notify(mode === 'password' ? 'Password updated. Other sessions were revoked.' : 'Two-factor authentication disabled.'); }
    }, error: error => { this.busy.set(false); this.securityError.set(apiError(error, this.localization)); } });
  }
  downloadCodes() { const blob = new Blob([this.recoveryCodes().join('\n') + '\n'], {type: 'text/plain'}); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'inventory-recovery-codes.txt'; anchor.click(); URL.revokeObjectURL(url); }
  eventLabel(event: string) { return event.replaceAll('_', ' '); }
  private notify(message: string) { this.snack.open(this.localization.text(message), this.localization.text('Close'), { duration: 5000 }); }
}
