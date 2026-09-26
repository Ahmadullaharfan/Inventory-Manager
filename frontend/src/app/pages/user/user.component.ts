import { Component, inject, computed } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { BasicTableTwoComponent, TableColumn } from '../../shared/components/tables/basic-tables/basic-table-two/basic-table-two.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { UserService } from './service/user.service';

@Component({
  imports: [PageBreadcrumbComponent, BasicTableTwoComponent, ComponentCardComponent],
  selector: 'app-user',
  styleUrl: './user.component.css',
  templateUrl: './user.component.html',
})
export class UserComponent {
  private userService = inject(UserService);

  public usersResource = this.userService.usersResource;

  // Columns must match the keys you emit in tableRowData
  tableColumns: TableColumn[] = [
    { key: 'id',       label: 'User ID' },
    { key: 'user',     label: 'User', type: 'avatar', nameKey: 'name', imageKey: 'avatarUrl' },
    { key: 'email',    label: 'Email' },
    { key: 'phone',    label: 'Phone' },
    { key: 'role',     label: 'Role' },
    { key: 'status',   label: 'Status' },
    { key: 'lastLogin', label: 'Last Login' },
    { key: 'actions',  label: 'Action', type: 'actions' },
  ];

public tableRowData = computed(() => {
  const apiUsers = this.usersResource.value() ?? [];

  return apiUsers.map(user => {
    return {
      id: `USR-${user.id}`,
      user: {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatarUrl: user.avatar_url,
      },
      email: user.email,
      phone: user.phone_number ?? '—',
      role: user.role,
      status: user.status,
      lastLogin: user.last_login_at
        ? new Date(user.last_login_at).toLocaleDateString()
        : 'Never',
      actions: { delete: true },
    };
  });
});
}