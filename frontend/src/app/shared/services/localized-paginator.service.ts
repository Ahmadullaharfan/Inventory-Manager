import { effect, inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LocalizationService } from './localization.service';

@Injectable()
export class LocalizedPaginatorIntl extends MatPaginatorIntl {
  private localization = inject(LocalizationService);
  constructor() {
    super();
    effect(() => {
      this.itemsPerPageLabel = this.localization.text('Items per page:');
      this.nextPageLabel = this.localization.text('Next page');
      this.previousPageLabel = this.localization.text('Previous page');
      this.firstPageLabel = this.localization.text('First page');
      this.lastPageLabel = this.localization.text('Last page');
      this.changes.next();
    });
  }
  override getRangeLabel = (page: number, size: number, length: number): string => {
    const start = length === 0 || size === 0 ? 0 : page * size + 1;
    const end = Math.min((page + 1) * size, length);
    return this.localization.text('{start}–{end} of {total}', { start: this.localization.number(start), end: this.localization.number(end), total: this.localization.number(length) });
  };
}
