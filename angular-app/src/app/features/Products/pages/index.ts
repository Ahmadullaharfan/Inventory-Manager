// Simplified Index component
import { Component, inject, signal, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { ProductService } from '../../Products/services/product.service';
import { Product } from '../models/product';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import type { ColumnConfig } from '../../../shared/components/data-table/data-table.types';

@Component({
  selector: 'app-index',
  imports: [CommonModule, DataTableComponent], 
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  productService = inject(ProductService);
  router = inject(Router);
  
  // Add ViewChild to access table component
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);

  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: 'Actions' }
  ];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products.set(products);
        this.isLoading.set(false);
        
        // Trigger refresh animation after data loads
        setTimeout(() => {
          if (this.dataTable) {
            this.dataTable.triggerRefreshAnimation();
          }
        }, 100);
      },
      error: (err: any) => {
        console.error('Error loading products', err);
        this.isLoading.set(false);
      }
    });
  }

  onRowEdit(product: Product) {
    this.router.navigate([`/products/edit/${product.id}`]);
  }

  onRowDelete(product: Product) {
    if (confirm('Are you sure?')) {
      console.log('onRowDelete Delete Function', product);
      this.isLoading.set(true);
      this.productService.deleteProduct(product.id!).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err: any) => {
          console.error('Delete error', err);
          this.isLoading.set(false);
        }
      });
    }
  }

  navigateToCreate() {
    this.router.navigate(['/products/create']);
  }
}