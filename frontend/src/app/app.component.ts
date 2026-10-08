import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalizationService } from './shared/services/localization.service';

@Component({ selector: 'app-root', standalone: true, imports: [RouterModule], templateUrl: './app.component.html', styleUrl: './app.component.css' })
export class AppComponent {
  readonly localization = inject(LocalizationService);
}
