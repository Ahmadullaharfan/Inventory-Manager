import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InputComponent } from '../../../../shared/components/ui/input/input';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent
  ],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductForm implements OnInit {

  // Dependency Injection
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Product Form
  productForm!: FormGroup;

  // Edit Mode
  isEditMode = false;

  // Product ID
  productId: number | null = null;

  // Selected Product Image
  selectedFile: File | null = null;


  ngOnInit(): void {
    this.initForm();
    this.checkForEditMode();
  }


  /**
   * Initialize Product Form
   */
  private initForm(): void {

    this.productForm = this.fb.group({

      product_category_id: [null],

      supplier_id: [null],

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      description: [''],

      brand: [''],

      cost_price: [
        '',
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      unit_of_measure: [
        '',
        [
          Validators.required
        ]
      ],

      units_per_package: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      location: [''],

      is_active: [true],

      image: [null]

    });

  }


  /**
   * Handle Product Image Selection
   */
  onFileSelected(event: Event): void {

    const inputElement = event.target as HTMLInputElement;

    if (
      inputElement.files &&
      inputElement.files.length > 0
    ) {

      this.selectedFile = inputElement.files[0];

    }

  }


  /**
   * Return to Product List
   */
  cancel(): void {
    this.router.navigate(['/products']);
  }


  /**
   * Check if we are Editing a Product
   */
  private checkForEditMode(): void {

    this.route.params.subscribe(params => {

      if (params['id']) {

        this.isEditMode = true;

        this.productId = +params['id'];

        this.loadProductData();

      }

    });

  }


  /**
   * Load Product Data for Editing
   */
  private loadProductData(): void {

    this.productService
      .getProduct(this.productId!)
      .subscribe({

        next: (res: any) => {

          this.productForm.patchValue({
            product_category_id: res.data.product_category_id,
            supplier_id: res.data.supplier_id,
            name: res.data.name,
            description: res.data.description,
            brand: res.data.brand,
            cost_price: res.data.cost_price,
            unit_of_measure: res.data.unit_of_measure,
            units_per_package: res.data.units_per_package,
            location: res.data.location,
            is_active: res.data.is_active
          });

        },

        error: (err) => {
          console.error(
            'Error fetching product data:',
            err
          );
        }

      });

  }


  /**
   * Create or Update Product
   */
  onSubmit(): void {

    // Check Form Validation
    if (this.productForm.invalid) {

      this.productForm.markAllAsTouched();

      return;

    }


    // Create FormData
    const formData = new FormData();


    // Category
    const productCategoryId =
      this.productForm.get('product_category_id')?.value;

    if (productCategoryId) {

      formData.append(
        'product_category_id',
        productCategoryId
      );

    }


    // Supplier
    const supplierId =
      this.productForm.get('supplier_id')?.value;

    if (supplierId) {

      formData.append(
        'supplier_id',
        supplierId
      );

    }


    // Product Name
    formData.append(
      'name',
      this.productForm.get('name')?.value
    );


    // Description
    formData.append(
      'description',
      this.productForm.get('description')?.value ?? ''
    );


    // Brand
    formData.append(
      'brand',
      this.productForm.get('brand')?.value ?? ''
    );


    // Cost Price
    formData.append(
      'cost_price',
      this.productForm.get('cost_price')?.value
    );


    // Unit Of Measure
    formData.append(
      'unit_of_measure',
      this.productForm.get('unit_of_measure')?.value
    );


    // Units Per Package
    formData.append(
      'units_per_package',
      this.productForm.get('units_per_package')?.value
    );


    // Location
    formData.append(
      'location',
      this.productForm.get('location')?.value ?? ''
    );


    // Active Status
    formData.append(
      'is_active',
      this.productForm.get('is_active')?.value ? '1' : '0'
    );


    // Product Image
    if (this.selectedFile) {

      formData.append(
        'image',
        this.selectedFile,
        this.selectedFile.name
      );

    }


    /**
     * Laravel PUT Method Override
     *
     * This is useful when updating
     * multipart/form-data with Laravel.
     */
    if (
      this.isEditMode &&
      this.productId
    ) {

      formData.append('_method', 'PUT');

    }


    /**
     * Determine whether to
     * CREATE or UPDATE
     */
    const request$ =
      this.isEditMode && this.productId

        ? this.productService.updateProduct(
            this.productId,
            formData
          )

        : this.productService.createProduct(
            formData
          );


    /**
     * Send Request
     */
    request$.subscribe({

      next: () => {

        this.router.navigate(['/products']);

      },


      error: (err) => {

        // Laravel Validation Errors
        if (err.error?.errors) {

          const validationErrors =
            err.error.errors;


          Object.keys(validationErrors)
            .forEach(field => {

              const control =
                this.productForm.get(field);


              if (control) {

                control.setErrors({

                  ...control.errors,

                  serverError:
                    validationErrors[field][0]

                });

              }

            });

        } else {

          console.error(
            'An unexpected transmission error occurred:',
            err
          );

        }

      }

    });

  }

}