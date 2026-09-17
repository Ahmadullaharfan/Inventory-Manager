import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { InputComponent } from 'app/main/shared/components/ui/input/input';
import { ImageDropzoneComponent } from 'app/main/shared/components/image-dropzone.componenet';
import { FieldErrorComponent } from 'app/main/shared/components/filed-error.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    FieldErrorComponent,
    ImageDropzoneComponent,
  ],
  templateUrl: './product-form.html',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isEditMode = false;
  productId: number | null = null;

  saving = signal(false);
  successMessage = signal<string | null>(null);

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    brand: [''],
    description: [''],
    cost_price: [null as number | null, [Validators.required, Validators.min(0)]],
    unit_of_measure: ['', [Validators.required]],
    units_per_package: [1, [Validators.required, Validators.min(1)]],
    location: [''],
    is_active: [true],
    image: [null as File | null],
  });

  previewUrl = signal<string | null>(null);

  ngOnInit(): void {
    // If edit mode, patch values + set previewUrl here
  }

  onFileSelected(file: File | null): void {
    this.productForm.patchValue({ image: file });
    this.productForm.get('image')?.markAsTouched();

    if (file) {
      const url = URL.createObjectURL(file);
      this.previewUrl.set(url);
    } else {
      this.previewUrl.set(null);
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.successMessage.set(null);
    this.clearServerErrors();

    const formData = this.buildFormData();

    const request$ =
      this.isEditMode && this.productId
        ? this.productService.updateProductWithFormData(this.productId, formData)
        : this.productService.createProductWithFormData(formData);

    request$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: (res) => {
          this.successMessage.set(
            res?.message ?? (this.isEditMode ? 'Product updated successfully.' : 'Product created successfully.'),
          );
          this.router.navigate(['/products']);
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 422 && err.error?.errors) {
            this.applyServerErrors(err.error.errors);
          } else {
            console.error('Unexpected error:', err);
          }
        },
      });
  }

  cancel(): void {
    this.productForm.reset({ is_active: true, units_per_package: 1 });
    this.previewUrl.set(null);
  }

  get f() {
    return this.productForm.controls;
  }

  // ------------------ Helpers ------------------

  private buildFormData(): FormData {
    const fd = new FormData();
    const value = this.productForm.getRawValue();

    const scalarFields: (keyof typeof value)[] = [
      'name',
      'brand',
      'description',
      'cost_price',
      'unit_of_measure',
      'units_per_package',
      'location',
    ];

    scalarFields.forEach((key) => {
      const v = value[key];
      if (v === null || v === undefined || v === '') return;
      fd.append(key as string, String(v));
    });

    // Booleans → "1" / "0" so Laravel validation handles them cleanly
    fd.append('is_active', value.is_active ? '1' : '0');

    if (value.image instanceof File) {
      fd.append('image', value.image, value.image.name);
    }

    return fd;
  }

  private applyServerErrors(errors: Record<string, string[]>): void {
    Object.entries(errors).forEach(([field, messages]) => {
      const control = this.productForm.get(field);
      if (!control) return;

      control.setErrors({ ...(control.errors ?? {}), serverError: messages[0] });
      control.markAsTouched();
    });
  }

  private clearServerErrors(): void {
    Object.values(this.productForm.controls).forEach((control: AbstractControl) => {
      const errs = control.errors;
      if (errs?.['serverError']) {
        const { serverError, ...rest } = errs;
        control.setErrors(Object.keys(rest).length ? rest : null);
      }
    });
  }
}