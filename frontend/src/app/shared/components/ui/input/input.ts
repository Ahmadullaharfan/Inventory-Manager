import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

type InputType = 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col gap-1.5 w-full">
      @if (label) {
        <label
          [for]="id"
          class="text-sm font-medium text-gray-700"
        >
          {{ label }}
          @if (required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value ?? ''"
        [disabled]="disabled"
        (input)="handleInput($event)"
        (blur)="onTouched()"
        class="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-white
               border border-gray-300 rounded-lg
               placeholder:text-gray-400
               transition-colors duration-150
               focus:outline-none focus:ring-2 focus:ring-black/80 focus:border-black
               disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
      />
    </div>
  `,
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputType = 'text';
  @Input() disabled = false;
  @Input() required = false;
  @Input() id = `input-${Math.random().toString(36).slice(2, 9)}`;

  value: string | number | null = null;

  private onChange: (v: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const raw = target.value;

    if (this.type === 'number') {
      const num = raw === '' ? null : Number(raw);
      this.value = num;
      this.onChange(num);
    } else {
      this.value = raw;
      this.onChange(raw);
    }
  }
}