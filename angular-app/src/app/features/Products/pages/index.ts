import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../Products/services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-index',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './index.html',
  styleUrl: './index.css',
})
export class Index implements OnInit {
  productService = inject(ProductService);
  fb = inject(FormBuilder);
  
  products = signal<Product[]>([]);
  showForm = signal(false);
  selectedId: number | null = null;
  productForm!: FormGroup;

  ngOnInit() {
    this.loadProducts();
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => this.products.set(products),
      error: (err: any) => console.error('Error loading products', err)
    });
  }

  toggleForm(productId?: number) {
    this.showForm.update(show => !show);
    if (productId) {
      this.selectedId = productId;
      this.productService.getProduct(productId).subscribe((product: Product) => {
        this.productForm.patchValue(product);
      });
    } else {
      this.selectedId = null;
      this.productForm.reset();
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.selectedId) {
        this.productService.updateProduct(this.selectedId, productData).subscribe({
          next: () => {
            this.loadProducts();
            this.resetForm();
          },
          error: (err: any) => console.error('Update error', err)
        });
      } else {
        this.productService.createProduct(productData).subscribe({
          next: () => {
            this.loadProducts();
            this.resetForm();
          },
          error: (err: any) => console.error('Create error', err)
        });
      }
    }
  }

  onDelete(id: number) {
    if (confirm('Are you sure?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err: any) => console.error('Delete error', err)
        });
    }
  }

  resetForm() {
    this.showForm.set(false);
    this.selectedId = null;
    this.productForm.reset();
  }
}
