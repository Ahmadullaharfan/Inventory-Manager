import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../customer-services/customer.service';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../../../shared/components/ui/input/input';

@Component({
  selector: 'app-customer-form',
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.css']
})
export class CustomerFormComponent implements OnInit {
  // ✅ Modern Angular Way: Clean inline Dependency Injection (No constructor needed)
  private fb = inject(FormBuilder);
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  customerForm!: FormGroup;
  isEditMode = false;
  customerId: number | null = null;
  selectedFile: File | null = null; // Tracks the chosen file stream safely

  ngOnInit(): void {
    this.initForm();
    this.checkForEditMode();
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      customer_name: ['', [Validators.required, Validators.minLength(3)]],
      father_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{6,14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      attachment: [null] 
    });
  }

  // Intercepts file selection with strict type safety checking
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    }
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }

  // ✅ Modern Angular Way: Use an active route observable stream instead of a static one-time snapshot
  private checkForEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.customerId = +params['id'];
        this.loadCustomerData();
      }
    });
  }

  private loadCustomerData(): void {
    this.customerService.getCustomer(this.customerId!).subscribe({
      next: (res: any) => this.customerForm.patchValue(res.data),
      error: (err) => console.error('Error fetching customer data:', err)
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    // Build the Multi-part Form Data envelope to support file transfers
    const formData = new FormData();
    formData.append('customer_name', this.customerForm.get('customer_name')?.value);
    formData.append('father_name', this.customerForm.get('father_name')?.value);
    formData.append('phone_number', this.customerForm.get('phone_number')?.value);
    formData.append('email', this.customerForm.get('email')?.value);
    formData.append('location', this.customerForm.get('location')?.value);
    
    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile, this.selectedFile.name);
    }

    // Determine request stream trajectory
    if (this.isEditMode && this.customerId) {
      formData.append('_method', 'PUT'); // Laravel method override for file streaming support
    }

    const request$ = this.isEditMode && this.customerId
      ? this.customerService.updateCustomer(this.customerId, formData)
      : this.customerService.createCustomer(formData);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/customers']),
        this.cancel(); 
      },
      error: (err) => {
        if (err.error?.errors) {
          const validationErrors = err.error.errors;

          Object.keys(validationErrors).forEach(field => {
            const control = this.customerForm.get(field);

            if (control) {
              control.setErrors({
                ...control.errors,
                serverError: validationErrors[field][0]
              });
            }
          });
        } else {
          console.error('An unexpected transmission error occurred:', err);
        }
      }
    });

  }
}
