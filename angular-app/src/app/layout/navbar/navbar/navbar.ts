import { Component } from '@angular/core';
import { NavbarLinksComponent } from '../navbar-links/navbar-links';
import { NavbarMenuComponent } from '../navbar-menu/navbar-menu';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NavbarLinksComponent, NavbarMenuComponent],
  templateUrl: './navbar.html'
})
export class NavbarComponent {}