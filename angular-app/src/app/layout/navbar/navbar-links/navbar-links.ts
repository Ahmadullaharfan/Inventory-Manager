import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar-links',
  standalone: true,
  templateUrl: './navbar-links.html',
  imports: [RouterLink]
})
export class NavbarLinksComponent {}