import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductCategoryService } from '../../services/product-category';
import { InputComponent } from '../../../../shared/components/ui/input/input';

@Component({
  selector: 'app-product-category-form',
  imports: [ReactiveFormsModule, CommonModule, InputComponent],
  templateUrl: './product-category-form.html',
  styleUrls: ['./product-category-form.css'] // Changed from styleUrl to styleUrls
})
export class ProductCategoryFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productCategoryService: ProductCategoryService
  ) {}

  productCategoryForm!: FormGroup;
  isEditMode = false;
  categoryId: number | null = null;

  ngOnInit() {
    this.productCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.maxLength(200)]]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory();
      }
    });
  }

  loadCategory() {
    this.productCategoryService.getCategoryById(this.categoryId!).subscribe(category => {
      this.productCategoryForm.patchValue(category);
    });
  }

  onSubmit() {
    if (this.productCategoryForm.invalid) {
      this.productCategoryForm.markAllAsTouched();
      return;
    }

    const categoryData = this.productCategoryForm.value;

    const request = this.isEditMode
      ? this.productCategoryService.updateCategory(this.categoryId!, categoryData)
      : this.productCategoryService.createCategory(categoryData);

    request.subscribe({
      next: () => this.router.navigate(['/productCategories']),
      error: (err) => {
        if (err.error?.errors) {
          const errors = err.error.errors;
          Object.keys(errors).forEach(field => {
            const control = this.productCategoryForm.get(field);
            if (control) {
              control.setErrors({
                ...control.errors,
                serverError: errors[field][0]
              });
            }
          });
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/productCategories']);
  }
}