// features/Products/pages/product-form/product-form.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {
  productService = inject(ProductService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['']
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  loadProduct() {
    this.productService.getProduct(this.productId!).subscribe(product => {
      this.productForm.patchValue(product);
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData = this.productForm.value;
    console.log('Submitting product data:', productData);

    if (this.isEditMode) {
      this.productService.updateProduct(this.productId!, productData).subscribe({
        next: () => this.router.navigate(['/products'])
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => this.router.navigate(['/products'])
      });
    }
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}