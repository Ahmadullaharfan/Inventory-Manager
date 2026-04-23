// Simplified Index component
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Add this
import { ProductService } from '../../Products/services/product.service';
import { Product } from '../models/product';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import type { ColumnConfig } from '../../../shared/components/data-table/data-table.types';

@Component({
  selector: 'app-index',
  imports: [CommonModule, DataTableComponent], // Remove ReactiveFormsModule
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  productService = inject(ProductService);
  router = inject(Router); // Add this
  
  products = signal<Product[]>([]);

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
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => this.products.set(products),
      error: (err: any) => console.error('Error loading products', err)
    });
  }

  onRowEdit(product: Product) {
    this.router.navigate([`/products/edit/${product.id}`]);
  }

  onRowDelete(product: Product) {
    if (confirm('Are you sure?')) {
          console.log('onRowDelete Delete Function', product);

      this.productService.deleteProduct(product.id!).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => console.error('Delete error', err)
      });
    }
  }

  navigateToCreate() {
    this.router.navigate(['/products/create']);
  }
}