import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-logo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-logo.html',
})
export class HeaderLogo {}