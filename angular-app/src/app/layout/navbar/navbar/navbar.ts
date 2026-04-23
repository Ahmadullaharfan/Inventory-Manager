import { Component } from '@angular/core';
import { NavbarLinksComponent } from '../navbar-links/navbar-links';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NavbarLinksComponent],
  templateUrl: './navbar.html'
})
export class NavbarComponent {}