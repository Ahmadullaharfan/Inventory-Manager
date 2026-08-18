import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { ProductCategoryService } from '../services/product-category.service';
import { ProductCategory } from '../models/product-category.model';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import type { ColumnConfig } from '../../../shared/components/data-table/data-table.types';


@Component({
  selector: 'app-product-catagory',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './product-catagory.html',
  styleUrls: ['./product-catagory.css'],
})
export class ProductCategoryListComponent implements OnInit {
  productCategoryService = inject(ProductCategoryService);
  router = inject(Router);
  
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  
  productCategory: ProductCategory[] = [];
  isLoading = true;

  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: 'Actions' }
  ];
  
  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(){
    this.isLoading = true;
    this.productCategoryService.getAllCategories().subscribe({
      next: (categories: ProductCategory[])=> {
        this.productCategory = categories;
        this.isLoading = false;
        setTimeout(()=>{
          if(this.dataTable){
            this.dataTable.triggerRefreshAnimation();
          }
        }, 100);
      },
      error: (err:any)=>{
        console.error('Error Loading Categories', err);
        this.isLoading = false;
      }
    });
  }
  
  onRowEdit(category: ProductCategory){
    this.router.navigate(['/productCategories/edit', category.id]);
  }

  onRowDelete(category: ProductCategory) {
    if (confirm('Are you sure you want to delete category ' + category.name + '?')) {
      console.log('Deleting Category', category);
      this.isLoading = true;
      this.productCategoryService.deleteCategory(category.id!).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err: any) => {
          console.error('Error Deleting Category', err);
          this.isLoading = false;
        }
      });
    }
  }

  navigateToCreate() {
    this.router.navigate(['/productCategories/create']);
  }

}
