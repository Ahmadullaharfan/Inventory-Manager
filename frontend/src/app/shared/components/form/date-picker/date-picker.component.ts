import { LocalizationService } from '../../../services/localization.service';
import { LocalizePipe } from '../../../pipe/localize.pipe';

import { inject, Component, Input, Output, EventEmitter, ElementRef, ViewChild, effect } from '@angular/core';
import flatpickr from 'flatpickr';
import { CustomLocale } from 'flatpickr/dist/types/locale';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-date-picker',
  imports: [LocalizePipe, LabelComponent],
  templateUrl: './date-picker.component.html',
  styles: ``
})
export class DatePickerComponent {
  readonly localization = inject(LocalizationService);

  @Input() id!: string;
  @Input() mode: 'single' | 'multiple' | 'range' | 'time' = 'single';
  @Input() defaultDate?: string | Date | string[] | Date[];
  @Input() label?: string;
  @Input() placeholder?: string;
  @Output() dateChange = new EventEmitter<any>();

  @ViewChild('dateInput', { static: false }) dateInput!: ElementRef<HTMLInputElement>;

  private flatpickrInstance: flatpickr.Instance | undefined;

  constructor() {
    effect(() => {
      this.localization.locale();
      this.flatpickrInstance?.set('locale', this.datePickerLocale());
    });
  }

  private datePickerLocale(): Partial<CustomLocale> {
    const locale = this.localization.locale();
    const format = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { ...options, calendar: 'gregory', timeZone: 'UTC' }).format(date);
    const weekdays = Array.from({ length: 7 }, (_, day) => new Date(Date.UTC(2023, 0, day + 1)));
    const months = Array.from({ length: 12 }, (_, month) => new Date(Date.UTC(2026, month, 1)));
    return {
      firstDayOfWeek: this.localization.language() === 'en' ? 0 as const : 6 as const,
      weekdays: { shorthand: weekdays.map(day => format(day, { weekday: 'short' })) as CustomLocale['weekdays']['shorthand'], longhand: weekdays.map(day => format(day, { weekday: 'long' })) as CustomLocale['weekdays']['longhand'] },
      months: { shorthand: months.map(month => format(month, { month: 'short' })) as CustomLocale['months']['shorthand'], longhand: months.map(month => format(month, { month: 'long' })) as CustomLocale['months']['longhand'] },
      rangeSeparator: ' — ',
      scrollTitle: this.localization.text('Scroll to increment'),
      toggleTitle: this.localization.text('Click to toggle'),
    };
  }

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      locale: this.datePickerLocale(),
      mode: this.mode,
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'Y-m-d',
      defaultDate: this.defaultDate,
      onChange: (selectedDates, dateStr, instance) => {
        this.dateChange.emit({ selectedDates, dateStr, instance });
      }
    });
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
