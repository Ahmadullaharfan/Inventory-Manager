import { LocalizePipe } from '../../../../pipe/localize.pipe';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { BadgeComponent } from '../../../ui/badge/badge.component';
export interface TableColumn { key: string; label: string; type?: 'text' | 'avatar' | 'badge' | 'actions'; nameKey?: string; imageKey?: string; }
export type TableRow = Record<string, any>;
@Component({ selector: 'app-basic-table-two', standalone: true, imports: [LocalizePipe, MatPaginatorModule, MatTableModule, MatSortModule, BadgeComponent], templateUrl: './basic-table-two.component.html' })
export class BasicTableTwoComponent implements AfterViewInit {
  @Input() title = '';
  @Input() dataSource = new MatTableDataSource<TableRow>();
  @Input() displayedColumns: string[] = [];
  @Input() columnHeaders: Record<string, string> = {};
  @Input() columns: TableColumn[] = [];
  @Input() actionsColumn = false;
  @Input() actions: { view?: boolean; edit: boolean; delete: boolean } = { edit: false, delete: false };
  @Input() canEditRow: (row: any) => boolean = () => true;
  @Input() canDeleteRow: (row: any) => boolean = () => true;
  @Input() emptyMessage = 'No records found.';
  @Output() viewRow = new EventEmitter<any>();
  @Output() editRow = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void { this.dataSource.paginator = this.paginator; this.dataSource.sort = this.sort; }
  get effectiveColumns(): string[] { return this.actionsColumn && (this.actions.view || this.actions.edit || this.actions.delete) ? this.displayedColumns : this.displayedColumns.filter(column => column !== 'actions'); }
  column(key: string) { return this.columns.find(column => column.key === key); }
  badgeColor(value: string): 'success' | 'error' | 'warning' | 'primary' { return value === 'active' ? 'success' : value === 'suspended' ? 'error' : value === 'inactive' ? 'warning' : 'primary'; }
}
