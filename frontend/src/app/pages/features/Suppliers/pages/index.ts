import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import type { ColumnConfig } from '../../../shared/components/data-table/data-table.types';
import { SupplierService } from '../../Suppliers/services/suppliers.service';
import { ProductSuppliers } from '../models/product-supplier.model';

@Component({
    selector: 'app-supplier-index', 
    standalone: true,
    imports: [CommonModule, DataTableComponent],
    templateUrl: './index.html',
    styleUrls: ['./index.css'], 
})

export class SupplersList implements OnInit {
    supplierService = inject(SupplierService);
    router = inject(Router);

    @ViewChild(DataTableComponent)
    dataTable!:DataTableComponent;

    suppliers: ProductSuppliers[] = [];
    isLoading = true;

    columns: ColumnConfig[] = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'contact_person', label: 'Contact Person' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Address' },
        { key: 'country', label: 'Country' },
        { key: 'actions', label: 'Actions' }
    ];
    
    
    ngOnInit(){
        this.LoadSuppliers();
    }

    LoadSuppliers(){
        this.isLoading = true;
        this.supplierService.getSuppliers().subscribe({
            next: (suppliers: ProductSuppliers[])=> { 
                this.suppliers = suppliers;
                this.isLoading = false;

                setTimeout(()=> {
                    if(this.dataTable){
                        this.dataTable.triggerRefreshAnimation();
                    }   
                }, 100);
            }, 
            error: (err: any) => {
                console.error('Error loading suppliers', err);
                this.isLoading = false;
            }
        });

    }

    onRowEdit(supplier: ProductSuppliers){
        this.router.navigate([`/suppliers/edit/${supplier.id}`]);
    } 

    onRowDelete(supplierId: number){
        if(confirm('Are you sure you want to delete this supplier?')){
            console.log('onRowDelete Delete Function', supplierId);
            this.isLoading = true;
            this.supplierService.deleteSupplier(supplierId!).subscribe({
                next:()=> {
                    this.LoadSuppliers();
                },
                error: (err:any) => {
                    console.error('Delete error', err);
                    this.isLoading = false;
                }
            })
        }

    } 
     
    navigateToCreate(){
        this.router.navigate(['/suppliers/create']); 
    }



}