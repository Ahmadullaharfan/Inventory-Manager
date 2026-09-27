import { AfterViewInit, Component, computed, effect, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { UserService } from './service/user.service';
import { User } from './module/user.module';


@Component({
  imports: [
    PageBreadcrumbComponent,
    ComponentCardComponent,
    MatPaginatorModule,
    MatTableModule,
   ],
  selector: 'app-user',
  styleUrl: './user.component.css',
  templateUrl: './user.component.html',
})
export class UserComponent implements AfterViewInit {
  private userService = inject(UserService);

  public usersResource = this.userService.usersResource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: (keyof User)[] = [
    'id',
    'first_name',
    'last_name',
    'email',
    'phone',
    'role',
    'status',
    'last_login_at',
  ];
  dataSource = new MatTableDataSource<User>();

  public tableRowData = computed(() => {
    const apiUsers = this.usersResource.value() ?? [];
    return apiUsers.map(user => {
      return {
        id: `USR-${user.id}`,
        first_name:user.first_name, 
        last_name:user.last_name,
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}