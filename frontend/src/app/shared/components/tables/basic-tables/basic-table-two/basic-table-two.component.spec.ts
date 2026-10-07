import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { BasicTableTwoComponent, TableRow } from './basic-table-two.component';
describe('Shared user table',()=>{
  let fixture:ComponentFixture<BasicTableTwoComponent>;let component:BasicTableTwoComponent;
  beforeEach(async()=>{await TestBed.configureTestingModule({imports:[BasicTableTwoComponent]}).compileComponents();fixture=TestBed.createComponent(BasicTableTwoComponent);component=fixture.componentInstance;});
  it('renders an empty table safely',()=>{fixture.detectChanges();expect(fixture.nativeElement.textContent).toContain('No records found.');});
  it('emits unchanged row IDs and hides disallowed deletion',()=>{const row={id:12,full_name:'Amina Ahmad',role:'user',status:'active'};component.dataSource=new MatTableDataSource<TableRow>([row]);component.displayedColumns=['full_name','status','actions'];component.columnHeaders={full_name:'User',status:'Status',actions:'Actions'};component.columns=[{key:'full_name',label:'User',type:'avatar'},{key:'status',label:'Status',type:'badge'}];component.actionsColumn=true;component.actions={view:true,edit:true,delete:true};component.canDeleteRow=()=>false;spyOn(component.editRow,'emit');fixture.detectChanges();expect(fixture.nativeElement.textContent).toContain('Amina Ahmad');const buttons=Array.from(fixture.nativeElement.querySelectorAll('button')) as HTMLButtonElement[];expect(buttons.some(button=>button.textContent?.trim()==='Delete')).toBeFalse();buttons.find(button=>button.textContent?.trim()==='Edit')!.click();expect(component.editRow.emit).toHaveBeenCalledWith(row);expect(component.dataSource.paginator).toBe(component.paginator);});
});
