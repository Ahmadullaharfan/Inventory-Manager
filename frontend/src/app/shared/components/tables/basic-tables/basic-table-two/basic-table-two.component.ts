
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { User } from '../../../../../pages/user/module/user.module';
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
    MatPaginatorModule,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './basic-table-two.component.html',
  styles: ``
})
export class BasicTableTwoComponent implements AfterViewInit {
  @Input() title: string = '';
  @Input() dataSource: any;
  @Input() displayedColumns: string[] = [];
  @Input() columnHeaders: Record<string, string> = {};
  @Input() columns: TableColumn[] = [];
  @Input() actionsColumn: boolean = false;
  @Input() actions: { edit: boolean; delete: boolean } = { edit: false, delete: false };
  @Output() editRow = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedRows: Array<string | number> = [];
  selectAll: boolean = false;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get effectiveColumns(): string[] {
    const hasActions =
      this.actionsColumn && (this.actions.edit || this.actions.delete);

    return hasActions
      ? this.displayedColumns
      : this.displayedColumns.filter((c) => c !== 'actions');
  }

  onEdit(row: User): void {
    this.editRow.emit(row);
  }

  onDelete(row: User): void {
    this.deleteRow.emit(row);
  }
}
