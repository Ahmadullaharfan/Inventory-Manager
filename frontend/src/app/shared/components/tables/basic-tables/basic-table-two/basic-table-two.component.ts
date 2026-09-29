
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

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
  @Input() showCheckbox: boolean = false;
  @Input() showActions: boolean = false;
  @Input() actions: string[] = [];
  @Input() isLoading: boolean = false;
  @Input() noDataMessage: string = 'No data available';
  @Input() showPagination: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() searchPlaceholder: string = 'Search...';
  @Input() searchKey: string = '';
  @Input() searchValue: string = '';
  @Input() searchFunction: (data: TableRow, searchValue: string) => boolean = (data, searchValue) => {
    return Object.values(data).some(value => value.toString().toLowerCase().includes(searchValue.toLowerCase()));
  };
  @Output() rowSelected: EventEmitter<TableRow> = new EventEmitter<TableRow>();
  @Output() selectAllRows: EventEmitter<boolean> = new EventEmitter<boolean>();
  

  selectedRows: Array<string | number> = [];
  selectAll: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
