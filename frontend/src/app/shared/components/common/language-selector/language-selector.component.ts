import { Component, inject } from '@angular/core';
import { LocalizationService } from '../../../services/localization.service';
import { LocalizePipe } from '../../../pipe/localize.pipe';

@Component({
  selector: 'app-language-selector', standalone: true, imports: [LocalizePipe],
  template: `
    <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
      <span>{{ 'Language' | localize }}</span>
      <select [attr.aria-label]="'Language' | localize" [value]="localization.language()" (change)="change($event)"
        class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
        @for (language of localization.languages; track language.id) {
          <option [value]="language.id" [attr.lang]="language.locale">{{ language.name }}</option>
        }
      </select>
    </label>
  `,
})
export class LanguageSelectorComponent {
  readonly localization = inject(LocalizationService);
  change(event: Event): void { this.localization.setLanguage((event.target as HTMLSelectElement).value); }
}
