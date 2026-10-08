import { inject, Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from '../services/localization.service';

@Pipe({ name: 'localize', standalone: true, pure: false })
export class LocalizePipe implements PipeTransform {
  private localization = inject(LocalizationService);
  transform(source: string | null | undefined, parameters?: Record<string, string | number>): string {
    return this.localization.text(source, parameters);
  }
}

@Pipe({ name: 'localizedDate', standalone: true, pure: false })
export class LocalizedDatePipe implements PipeTransform {
  private localization = inject(LocalizationService);
  transform(value: string | number | Date | null | undefined): string { return this.localization.date(value); }
}
