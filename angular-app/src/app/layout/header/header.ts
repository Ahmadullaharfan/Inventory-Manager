import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderLogo } from './header-logo/header-logo';
import { HeaderTopbar } from './header-topbar/header-topbar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HeaderLogo, HeaderTopbar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  headerSticky = false;

  @HostListener('window:scroll')
  onScroll() {
    this.headerSticky = window.scrollY > 0;
  }
}