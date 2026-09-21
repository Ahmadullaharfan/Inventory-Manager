
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../services/suppliers.service';
import { InputComponent } from '../../../../shared/components/ui/input/input';

@Component({
  selector: 'app-supplier-form',
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './supplier-form.html',
  styleUrls: ['./supplier-form.css'],
})
export class SupplierForm implements OnInit {

  supplierService = inject(SupplierService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router)

  supplierForm!: FormGroup;
  isEditMode = false;
  supplierId: number | null= null;
  
  phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  ngOnInit() {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)] ],
      contact_person: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
      email: ['', [Validators.required,Validators.email ] ],
      address:[''], 
      country: []
    })

     this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.supplierId = +params['id'];
        this.loadSupplier();
      }
    });

  } 

  
  loadSupplier() {
    this.supplierService.getSupplier(this.supplierId!).subscribe(supplier => {
      this.supplierForm.patchValue(supplier);
    });
  }

 onSubmit() {
  if (this.supplierForm.invalid) {
    this.supplierForm.markAllAsTouched();
    return;
  }

  const supplierData = {
    ...this.supplierForm.value
  };

  const request = this.isEditMode
    ? this.supplierService.updateSupplier(this.supplierId!, supplierData)
    : this.supplierService.createSupplier(supplierData);

  request.subscribe({
    next: () => {
      this.router.navigate(['/suppliers']);
    },

    error: (err) => {
      if (err.error?.errors) {
        const errors = err.error.errors;

        Object.keys(errors).forEach(field => {
          const control = this.supplierForm.get(field);

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
    this.router.navigate(['/suppliers']);
  }
}
