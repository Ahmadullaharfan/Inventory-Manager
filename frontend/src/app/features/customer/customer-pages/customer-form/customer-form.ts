import { Component, OnInit } from '@angular/core';
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
  customerForm!: FormGroup;
  isEditMode: boolean = false;
  customerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkForEditMode();
  }

  // Build the form controls with validation rules
  private initForm(): void {
    this.customerForm = this.fb.group({
      customer_name: ['', [Validators.required, Validators.minLength(3)]],
      father_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{7,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      attachment: [''] // Optional field
    });
  }

  // Checks the active route to see if an ID is provided for editing
  private checkForEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.customerId = +idParam;
      
      // Fetch user data from Laravel backend and patch it into the form
      this.customerService.getCustomer(this.customerId).subscribe({
        next: (customer) => this.customerForm.patchValue(customer),
        error: (err) => console.error('Error fetching customer data:', err)
      });
    }
  }

  // Handles form submission
  onSubmit(): void {
    if (this.customerForm.invalid) {
      return;
    }

    const payload = this.customerForm.value;

    if (this.isEditMode && this.customerId) {
      // Calls PUT /api/customers/{id}
      this.customerService.updateCustomer(this.customerId, payload).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => console.error('Error updating customer:', err)
      });
    } else {
      // Calls POST /api/customers
      this.customerService.createCustomer(payload).subscribe({
        next: () => this.handleSuccess(),
        error: (err) => console.error('Error creating customer:', err)
      });
    }
  }

  private handleSuccess(): void {
    alert(this.isEditMode ? 'Customer updated successfully!' : 'Customer created successfully!');
    this.router.navigate(['/customers']); // Redirect to the customer list page
  }
}
