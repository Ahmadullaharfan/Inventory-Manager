import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ColumnConfig } from './data-table.types';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] | ReadonlyArray<ColumnConfig> = [];
  @Input() loading = false;
  @Input() loadingLabel = 'Loading…';

  @Output() rowEdit = new EventEmitter<any>();
  @Output() rowDelete = new EventEmitter<any>();

  isRefreshing = false;

  ngOnChanges(changes: SimpleChanges): void {
    // Pulse the table whenever data changes (skip the very first empty render)
    if (changes['data'] && !changes['data'].firstChange) {
      this.isRefreshing = true;
      setTimeout(() => (this.isRefreshing = false), 200);
    }
  }

  formatPrice(value: number | string): string {
    const n = Number(value);
    if (Number.isNaN(n)) return String(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(n);
  }

  onEdit(row: any): void {
    this.rowEdit.emit(row);
  }

  onDelete(id: any): void {
    this.rowDelete.emit(id);
  }
}