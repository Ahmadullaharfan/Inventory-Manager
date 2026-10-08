import { LocalizationService } from '../../shared/services/localization.service';
import { LocalizePipe } from '../../shared/pipe/localize.pipe';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { BasicTableTwoComponent, TableColumn } from '../../shared/components/tables/basic-tables/basic-table-two/basic-table-two.component';
import { ConfirmDialogComponent } from '../../shared/components/ui/confirm_dialog/confirm-dialog.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { SelectComponent } from '../../shared/components/form/select/select.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { AuthService } from '../../shared/services/auth.service';
import { UserService, apiError } from './service/user.service';
import { User } from './module/user.module';
import { UserFormDialogComponent } from './components/user-form-dialog.component';
@Component({ selector: 'app-user', standalone: true, imports: [LocalizePipe, PageBreadcrumbComponent, ComponentCardComponent, BasicTableTwoComponent, InputFieldComponent, SelectComponent, ButtonComponent], templateUrl: './user.component.html', styleUrl: './user.component.css' })
export class UserComponent {
  readonly localization = inject(LocalizationService);
  readonly auth = inject(AuthService);
  private users = inject(UserService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  readonly usersResource = this.users.usersResource;
  readonly search = signal('');
  readonly role = signal('');
  readonly status = signal('');
  readonly deleting = signal(false);
  readonly total = computed(() => this.usersResource.value().length);
  readonly active = computed(() => this.usersResource.value().filter(user => user.status === 'active').length);
  readonly admins = computed(() => this.usersResource.value().filter(user => user.role === 'admin').length);
  readonly roles = [{ value: 'admin', label: 'Admin' }, { value: 'manager', label: 'Manager' }, { value: 'user', label: 'User' }];
  readonly statuses = [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'suspended', label: 'Suspended' }];
  readonly displayedColumns = ['display_id', 'full_name', 'email', 'phone_number', 'role', 'status', 'last_login_label', 'actions'];
  readonly columnHeaders = { display_id: 'ID', full_name: 'User', email: 'Email', phone_number: 'Phone', role: 'Role', status: 'Status', last_login_label: 'Last login', actions: 'Actions' };
  readonly columns: TableColumn[] = [{ key: 'full_name', label: 'User', type: 'avatar', nameKey: 'full_name', imageKey: 'avatar_url' }, { key: 'status', label: 'Status', type: 'badge' }, { key: 'role', label: 'Role', type: 'badge' }];
  readonly dataSource = new MatTableDataSource<any>();
  readonly canEdit = (row: User) => this.auth.isAdmin() || this.auth.user()?.id === row.id;
  readonly canDelete = (row: User) => this.auth.isAdmin() && this.auth.user()?.id !== row.id && !this.deleting();
  constructor() {
    effect(() => {
      const query = this.search().trim().toLowerCase();
      this.dataSource.data = this.usersResource.value().filter(user => (!this.role() || user.role === this.role()) && (!this.status() || user.status === this.status()) && [user.id, user.first_name, user.last_name, user.email, user.phone_number].join(' ').toLowerCase().includes(query)).map(user => ({ ...user, display_id: 'USR-' + user.id, full_name: user.first_name + ' ' + user.last_name, last_login_label: user.last_login_at ? this.localization.date(user.last_login_at) : this.localization.text('Never') }));
      this.dataSource.paginator?.firstPage();
    });
  }
  reload() { this.users.reloadUsers(); }
  handleAddUser() { this.openForm(); }
  onViewUser(user: User) { void this.router.navigate(['/users', user.id]); }
  onEditUser(user: User) { this.users.get(user.id).subscribe({ next: detail => this.openForm(detail), error: error => this.notify(apiError(error, this.localization)) }); }
  private openForm(user?: User) {
    this.dialog.open(UserFormDialogComponent, { width: '760px', maxWidth: '95vw', disableClose: true, data: { user } }).afterClosed().subscribe((saved?: User) => { if (saved) { this.auth.updateCurrent(saved); this.reload(); this.notify(user ? 'User updated.' : 'User created.'); } });
  }
  onDeleteUser(user: User) {
    if (!this.canDelete(user)) return;
    this.dialog.open(ConfirmDialogComponent, { width: '420px', data: { title: 'Delete user', message: this.localization.text('Delete {name}? Their sessions will be revoked.', { name: user.first_name + ' ' + user.last_name }), confirmText: 'Delete', confirmColor: 'warn' } }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.deleting.set(true);
      this.users.delete(user.id).subscribe({ next: () => { this.deleting.set(false); this.reload(); this.notify('User deleted.'); }, error: error => { this.deleting.set(false); this.notify(apiError(error, this.localization)); } });
    });
  }
  private notify(message: string) { this.snack.open(this.localization.text(message), this.localization.text('Close'), { duration: 5000 }); }
}
