import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (control && control.errors && control.touched) {
      <p class="text-xs text-red-500 font-medium mt-1">
        {{ message }}
      </p>
    }
  `,
})
export class FieldErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() label = 'This field';

  get message(): string {
    const e = this.control?.errors;
    if (!e) return '';

    if (e['serverError']) return e['serverError'];
    if (e['required']) return `${this.label} is required`;
    if (e['minlength'])
      return `${this.label} must be at least ${e['minlength'].requiredLength} characters`;
    if (e['min']) return `${this.label} must be at least ${e['min'].min}`;
    if (e['max']) return `${this.label} must be at most ${e['max'].max}`;
    if (e['email']) return `Please enter a valid email`;

    return 'Invalid value';
  }
}