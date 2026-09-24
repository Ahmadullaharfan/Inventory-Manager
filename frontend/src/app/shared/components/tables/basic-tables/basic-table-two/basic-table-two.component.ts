
import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../../../ui/badge/badge.component';
import { AvatarTextComponent } from '../../../ui/avatar/avatar-text.component';
import { CheckboxComponent } from '../../../form/input/checkbox.component';

@Component({
  selector: 'app-basic-table-two',
  imports: [
    BadgeComponent,
    AvatarTextComponent,
    CheckboxComponent
],
  templateUrl: './basic-table-two.component.html',
  styles: ``
})
export class BasicTableTwoComponent {

  
  @Input() tableRowData: any[] = [];
  @Input() tableColumns: any[] = [];
  selectedRows: string[] = [];
  selectAll: boolean = false;

  handleSelectAll() {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedRows = this.tableRowData.map(row => row.id);
    } else {
      this.selectedRows = [];
    }
  }

  handleRowSelect(id: string) {
    if (this.selectedRows.includes(id)) {
      this.selectedRows = this.selectedRows.filter(rowId => rowId !== id);
    } else {
      this.selectedRows = [...this.selectedRows, id];
    }
  }

  getBadgeColor(type: string): 'success' | 'warning' | 'error' {
    if (type === 'Complete') return 'success';
    if (type === 'Pending') return 'warning';
    return 'error';
  }
}
