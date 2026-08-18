import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ColumnConfig } from './data-table.types';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] | ReadonlyArray<ColumnConfig> = [];
  @Input() loading = false;
  @Input() loadingLabel = 'Loading...';
  @Output() rowEdit = new EventEmitter<any>();
  @Output() rowDelete = new EventEmitter<any>();

  // Add refresh animation trigger
  isRefreshing = false;

  formatPrice(value: number): string {
    return `$${value}`;
  }

  onEdit(row: any) {
    this.rowEdit.emit(row);
  }

  onDelete(ProductId: any) {
    this.rowDelete.emit(ProductId);
  }

  // Method to trigger refresh animation from parent
  triggerRefreshAnimation() {
    this.isRefreshing = true;
    setTimeout(() => {
      this.isRefreshing = false;
    }, 600);
  }
}