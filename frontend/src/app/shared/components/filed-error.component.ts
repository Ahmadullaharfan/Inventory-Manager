import { LocalizePipe } from '../pipe/localize.pipe';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { inject } from '@angular/core';
import { LocalizationService } from '../services/localization.service';

@Component({
  selector: 'app-field-error',
  standalone: true,
  imports: [LocalizePipe, CommonModule],
  template: `
    @if (control && control.errors && control.touched) {
      <p class="text-xs text-red-500 font-medium mt-1">
        {{ (message) | localize }}
      </p>
    }
  `,
})
export class FieldErrorComponent {
  private localization = inject(LocalizationService);
  @Input() control: AbstractControl | null = null;
  @Input() label = 'This field';

  get message(): string {
    const e = this.control?.errors;
    if (!e) return '';

    if (e['serverError']) return e['serverError'];
    const field = this.localization.text(this.label);
    if (e['required']) return this.localization.text('{field} is required', { field });
    if (e['minlength'])
      return this.localization.text('{field} must be at least {min} characters', { field, min: e['minlength'].requiredLength });
    if (e['min']) return this.localization.text('{field} must be at least {min}', { field, min: e['min'].min });
    if (e['max']) return this.localization.text('{field} must be at most {max}', { field, max: e['max'].max });
    if (e['email']) return this.localization.text('Please enter a valid email');

    return this.localization.text('Invalid value');
  }
}