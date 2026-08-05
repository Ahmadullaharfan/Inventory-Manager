// features/Products/pages/product-form/product-form.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { InputComponent } from '../../../../shared/components/ui/input/input';
import { ProductCategoryService } from '../../../ProductCatagory/services/product-category';
import { ProductCategory } from '../../../ProductCatagory/models/product-category.model';
import { ProductSuppliers } from '../../../Suppliers/models/product-supplier.model';
import { SupplierService } from '../../../Suppliers/services/suppliers.service';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.css']
})
export class ProductFormComponent implements OnInit {
  productService = inject(ProductService);
  productCategoryService = inject(ProductCategoryService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  supplierService = inject(SupplierService);
  
  productForm!: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  categories: ProductCategory[] = [];
  suppliers: ProductSuppliers[] = [];
  
  // Image handling properties
  imagePreview: string | null = null;
  imageFileName: string | null = null;
  selectedImageFile: File | null = null;
  imageUrl: string | null = null;
  isImageFromUrl = false;

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      product_category_id: [null],
      supplier_id: [null],
      description: [''],
      brand: [''],
      cost_price: [0, [Validators.required, Validators.min(0)]],
      unit_of_measure: ['', Validators.required],
      units_per_package: [1, [Validators.required, Validators.min(1)]],
      location: [''],
      image: [''],
      is_active: [true]
    });

    this.loadCategories();
    this.loadSuppliers();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  loadProduct() {
    this.productService.getProduct(this.productId!).subscribe({
      next: (product) => {
        // Patch all form values - use the correct property name from your API
        this.productForm.patchValue({
          name: product.name,
          product_category_id: product.product_category_id,
          supplier_id: product.supplier_id, // Make sure this matches your API response
          description: product.description,
          brand: product.brand,
          cost_price: product.cost_price,
          unit_of_measure: product.unit_of_measure,
          units_per_package: product.units_per_package,
          location: product.location,
          image: product.image,
          is_active: product.is_active === 1 || product.is_active === '1' || product.is_active === true
        });
        
        // Set image preview if image URL exists
        if (product.image) {
          this.imagePreview = product.image;
          this.imageUrl = product.image;
          this.isImageFromUrl = true;
          this.imageFileName = product.image.split('/').pop() || 'Image';
        }
      },
      error: (err) => {
        console.error('Error loading product', err);
      }
    });
  }

  loadCategories() {
    this.productCategoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      }
    });
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
      },
      error: (err) => {
        console.error('Error loading suppliers', err);
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        input.value = '';
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        input.value = '';
        return;
      }
      
      this.selectedImageFile = file;
      this.imageFileName = file.name;
      this.imageUrl = null;
      this.isImageFromUrl = false;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Clear the image form control since we'll use FormData
      this.productForm.patchValue({
        image: ''
      });
    }
  }

  onImageUrlInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const url = input.value;
    
    if (url && url.startsWith('http')) {
      this.imageUrl = url;
      this.imagePreview = url;
      this.selectedImageFile = null;
      this.imageFileName = null;
      this.isImageFromUrl = true;
    } else if (!url) {
      this.imageUrl = null;
      this.imagePreview = null;
      this.isImageFromUrl = false;
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.imageFileName = null;
    this.selectedImageFile = null;
    this.imageUrl = null;
    this.isImageFromUrl = false;
    this.productForm.patchValue({
      image: ''
    });
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    // Check if we have a file or URL for image
    const hasImage = this.selectedImageFile || this.imageUrl;

    if (hasImage) {
      // Use FormData for file upload
      const formData = new FormData();
      
      // Add all form fields
      formData.append('name', this.productForm.get('name')?.value || '');
      formData.append('description', this.productForm.get('description')?.value || '');
      formData.append('brand', this.productForm.get('brand')?.value || '');
      formData.append('cost_price', String(this.productForm.get('cost_price')?.value || 0));
      formData.append('unit_of_measure', this.productForm.get('unit_of_measure')?.value || '');
      formData.append('units_per_package', String(this.productForm.get('units_per_package')?.value || 1));
      formData.append('location', this.productForm.get('location')?.value || '');
      
      // FIX: Send is_active as string '1' or '0'
      const isActive = this.productForm.get('is_active')?.value;
      formData.append('is_active', isActive ? '1' : '0');
      
      // Add category and supplier (handle null values)
      const categoryId = this.productForm.get('product_category_id')?.value;
      if (categoryId) {
        formData.append('product_category_id', String(categoryId));
      }
      
      const supplierId = this.productForm.get('supplier_id')?.value;
      if (supplierId) {
        formData.append('supplier_id', String(supplierId));
      }

      // Handle image - either file or URL
      if (this.selectedImageFile) {
        // If file is selected, append the file
        formData.append('image', this.selectedImageFile, this.selectedImageFile.name);
      } else if (this.imageUrl) {
        // If URL is provided, append as string
        formData.append('image', this.imageUrl);
      }

      // Send with FormData
      const request = this.isEditMode
        ? this.productService.updateProductWithFormData(this.productId!, formData)
        : this.productService.createProductWithFormData(formData);

      request.subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => this.handleError(err)
      });
    } else {
      // No image - use regular JSON
      const productData = {
        name: this.productForm.get('name')?.value || '',
        description: this.productForm.get('description')?.value || '',
        brand: this.productForm.get('brand')?.value || '',
        cost_price: Number(this.productForm.get('cost_price')?.value || 0),
        unit_of_measure: this.productForm.get('unit_of_measure')?.value || '',
        units_per_package: Number(this.productForm.get('units_per_package')?.value || 1),
        location: this.productForm.get('location')?.value || '',
        // FIX: Send is_active as boolean or 1/0 based on your API expectations
        is_active: this.productForm.get('is_active')?.value ? true : false,
        product_category_id: this.productForm.get('product_category_id')?.value 
            ? Number(this.productForm.get('product_category_id')?.value) 
            : null,
        supplier_id: this.productForm.get('supplier_id')?.value 
            ? Number(this.productForm.get('supplier_id')?.value) 
            : null,
        image: this.productForm.get('image')?.value || ''
      };

      const request = this.isEditMode
        ? this.productService.updateProduct(this.productId!, productData)
        : this.productService.createProduct(productData);

      request.subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any): void {
    if (err.error?.errors) {
      const errors = err.error.errors;
      Object.keys(errors).forEach(field => {
        const control = this.productForm.get(field);
        if (control) {
          control.setErrors({
            ...control.errors,
            serverError: errors[field][0]
          });
        }
      });
    }
    console.error('Submit error:', err);
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}