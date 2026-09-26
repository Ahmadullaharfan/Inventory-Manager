
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvatarTextComponent } from '../../../ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../../form/input/checkbox.component';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'avatar' | 'actions';
  nameKey?: string;
  imageKey?: string;
}

export type TableRow = object;

@Component({
  selector: 'app-basic-table-two',
  imports: [
    AvatarTextComponent,
    CheckboxComponent
  ],
  templateUrl: './basic-table-two.component.html',
  styles: ``
})
export class BasicTableTwoComponent {
  @Input() title = '';
  @Input() rowKey = 'id';
  @Input() selectable = true;
  @Input() tableRowData: TableRow[] = [];
  @Input() tableColumns: TableColumn[] = [];
  @Output() rowAction = new EventEmitter<{ action: 'delete'; row: TableRow }>();

  selectedRows: Array<string | number> = [];
  selectAll: boolean = false;

  handleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedRows = this.tableRowData
        .map(row => this.getRowKey(row))
        .filter((key): key is string | number => key !== undefined);
    } else {
      this.selectedRows = [];
    }
  }

  handleRowSelect(id: string | number | undefined) {
    if (id === undefined) return;

    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }

    this.selectAll = this.tableRowData.length > 0 && this.tableRowData.every(row => {
      const rowKey = this.getRowKey(row);
      return rowKey !== undefined && this.selectedRows.includes(rowKey);
    });
  }

  getRowKey(row: TableRow): string | number | undefined {
    const value = this.getNestedValue(row, this.rowKey);
    return typeof value === 'string' || typeof value === 'number' ? value : undefined;
  }

  getCellValue(row: TableRow, column: TableColumn): unknown {
    const value = this.getNestedValue(row, column.key);
    if (column.type !== 'avatar' || !value || typeof value !== 'object') return value;
    return this.getNestedValue(value, column.nameKey ?? 'name');
  }

  getAvatarName(row: TableRow, column: TableColumn): string {
    const name = this.getCellValue(row, column);
    return typeof name === 'string' ? name : '';
  }

  getAvatarImage(row: TableRow, column: TableColumn): string | undefined {
    const value = this.getNestedValue(row, column.key);
    if (!value || typeof value !== 'object') return undefined;

    const image = this.getNestedValue(value, column.imageKey ?? 'avatarUrl');
    return typeof image === 'string' && image.length > 0 ? image : undefined;
  }

  hasDeleteAction(row: TableRow, column: TableColumn): boolean {
    return this.getNestedValue(row, `${column.key}.delete`) === true;
  }

  private getNestedValue(value: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, value);
  }
}
