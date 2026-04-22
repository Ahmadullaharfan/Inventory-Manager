import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  title: string;
  path?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-navbar-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar-menu.html'
})
export class NavbarMenuComponent {

  // 🔥 Replace this with your real MENU_HEADER later
  menu: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/'
    },
    {
      title: 'Products',
      children: [
        { title: 'List', path: '/products' },
        { title: 'Create', path: '/products/create' }
      ]
    }
  ];
}