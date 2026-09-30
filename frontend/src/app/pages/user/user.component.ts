import { Component, computed, effect, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { UserService } from './service/user.service';
import { User } from './module/user.module';
import { ConfirmDialogComponent } from '../../shared/components/ui/confirm_dialog/confirm-dialog.component';
import { BasicTableTwoComponent } from '../../shared/components/tables/basic-tables/basic-table-two/basic-table-two.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserFormDialogComponent } from './components/user-form-dialog.component';

@Component({
  standalone: true,
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    BasicTableTwoComponent,
  ],
  selector: 'app-user',
  styleUrl: './user.component.css',
  templateUrl: './user.component.html',
})

export class UserComponent {

  private userService = inject(UserService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public usersResource = this.userService.usersResource;

  displayedColumns: (keyof User)[] = [
    'id',
    'first_name',
    'last_name',
    'email',
    'phone',
    'role',
    'status',
    'last_login_at',
    'actions',
  ];
  actionsColumn: boolean = true;
  actions: { edit: boolean; delete: boolean } = { edit: true, delete: true };
  columnHeaders: Record<keyof User, string> = {
    id: 'ID',
    user: 'User',
    first_name: 'First Name',
    last_name: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    avatar_url: 'Avatar',
    email_verified: 'Email Verified',
    status: 'Status',
    last_login_at: 'Last Login',
    actions: 'Actions',
  };

  dataSource = new MatTableDataSource<User>();

  public tableRowData = computed(() => {
    const apiUsers = this.usersResource.value() ?? [];
    return apiUsers.map(user => {
      return {
        id: `USR-${user.id}`,
        first_name: user.first_name,
        last_name: user.last_name,
        user: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone ?? '—',
        role: user.role,
        status: user.status,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
        last_login_at: user.last_login_at
          ? new Date(user.last_login_at).toLocaleDateString()
          : 'Never',
      };
    });
  });

  constructor() {
    effect(() => {
      this.dataSource.data = this.tableRowData();
    });
  }


  // --- EDIT ---------------------------------------------------------
  onEditUser(user: User): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '600px',
      data: { user },                
    });

    ref.afterClosed().subscribe((result: User | undefined) => {
      if (!result) return;       

      this.userService.update(result.id, result).subscribe({
        next: (updated) => {
          const idx = this.dataSource.data.findIndex((u: User) => u.id === updated.id);
          if (idx > -1) {
            this.dataSource.data[idx] = updated;
            this.dataSource.data = [...this.dataSource.data]; // trigger change detection
          }
          this.snackBar.open('User updated', 'Close', { duration: 2500 });
        },
        error: (err) => {
          this.snackBar.open('Update failed: ' + err.message, 'Close', { duration: 4000 });
        },
      });
    });
  }

  // --- DELETE -------------------------------------------------------
  onDeleteUser(user: User): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete user',
        message: `Are you sure you want to delete "${user.first_name} ${user.last_name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn',
      },
    });

    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;

      this.userService.delete(user.id).subscribe({
        next: () => {
          // Option A: mutate in place
          this.dataSource.data = this.dataSource.data.filter((u: User) => u.id !== user.id);
          this.snackBar.open('User deleted', 'Close', { duration: 2500 });
        },
        error: (err) => {
          this.snackBar.open('Delete failed: ' + err.message, 'Close', { duration: 4000 });
        },
      });
    });
  }

}