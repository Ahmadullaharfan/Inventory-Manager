// features/Products/pages/product-form/product-form.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { InputComponent } from '../../../../shared/components/ui/input/input';

// Remove this line - no animations import needed
// import { trigger, transition, style, animate, state, query, stagger, animateChild } from '@angular/animations';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
  // Remove animations array - no longer needed
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
      name: ['', [Validators.required, Validators.minLength(3)]],
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

    const request = this.isEditMode
      ? this.productService.updateProduct(this.productId!, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: () => this.router.navigate(['/products']),

      error: (err) => {
        // 🔥 Handle server validation errors
        if (err.error?.errors) {
          const errors = err.error.errors;

          Object.keys(errors).forEach(field => {
            const control = this.productForm.get(field);

            if (control) {
              control.setErrors({
                ...control.errors,
                serverError: errors[field][0] // take first error
              });
            }
          });
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}