import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { NavbarComponent } from './layout/navbar/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Products Manager');
}
