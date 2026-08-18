// index.component.ts
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { ProductService } from '../../Products/services/product.service';
import { Product } from '../models/product.model';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import type { ColumnConfig } from '../../../shared/components/data-table/data-table.types';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, DataTableComponent], 
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
})
export class Index implements OnInit {
  productService = inject(ProductService);
  router = inject(Router);
  
  @ViewChild(DataTableComponent) dataTable!: DataTableComponent;
  
  products: Product[] = [];
  isLoading = true;

  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'category_name', label: 'Category' },
    { key: 'cost_price', label: 'Price' },
    { key: 'units_per_package', label: 'Stock' },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: 'Actions' }
  ];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products: any) => {
       
        
        // Ensure we have an array
        let productArray: Product[] = [];
        
        if (Array.isArray(products)) {
          productArray = products;
        } else if (products && products.data && Array.isArray(products.data)) {
          // If the response has a data property
          productArray = products.data;
        } else {
          console.error('Unexpected products format:', products);
          productArray = [];
        }
        
        // Transform the data
        const transformedProducts = productArray.map(product => ({
          ...product,
          category_name: product.category?.name || 'No Category',
          // If you need to format price
          cost_price: product.cost_price ? `$${product.cost_price}` : '0',
        }));
        
        this.products = transformedProducts;
        this.isLoading = false;
        
        setTimeout(() => {
          if (this.dataTable) {
            this.dataTable.triggerRefreshAnimation();
          }
        }, 100);
      },
      error: (err: any) => {
        console.error('Error loading products', err);
        this.isLoading = false;
        this.products = []; // Set empty array on error
      }
    });
  }

  onRowEdit(product: Product) {
    this.router.navigate([`/products/edit/${product.id}`]);
  }

  onRowDelete(productId: number) {
    if (confirm('Are you sure?')) {
      this.isLoading = true;
      this.productService.deleteProduct(productId!).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err: any) => {
        console.error('Delete error', err);
        this.isLoading = false;
        }
      });
    }
  }

  navigateToCreate() {
    this.router.navigate(['/products/create']);
  }
}