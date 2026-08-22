import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Customer } from '../customer-models/customer.model';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { CustomerService } from '../customer-services/customer.service';

@Component({
    selector: 'app-customer-pages',
    imports: [CommonModule, DataTableComponent],
    templateUrl: './customer-pages.html',
    styleUrls: ['./customer-pages.css']
})
export class CustomerPages implements OnInit {
  // Inject dependencies using modern Angular inject syntax
  private customerService = inject(CustomerService);
  private router = inject(Router);

  // State management
  customers: Customer[] = [];
  isLoading = false;

  // Configuration for your app-data-table columns
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'customer_name', label: 'Customer Name' },
    { key: 'father_name', label: "Father's Name" },
    { key: 'phone_number', label: 'Phone Number' },
    { key: 'email', label: 'Email' },
    { key: 'location', label: 'Location' },
    { key: 'attachment', label: 'Attachment' },
    { key: 'actions', label: 'Action'}
  ];

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Fetch data from your Laravel backend API
  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (response: any) => {
        // Check if response has a 'data' property (pagination)
        if (response && response.data) {
          this.customers = response.data;  // Extract the data array
        } else if (Array.isArray(response)) {
          // Fallback for non-paginated response
          this.customers = response;
        } else {
          this.customers = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch customers:', err);
        this.isLoading = false;
      }
    });
  }

  // Action: Navigate to the creation form
  navigateToCreate(): void {
    this.router.navigate(['/customers/create']);
  }

  // Action: Triggered when editing a row
  onRowEdit(customer: Customer): void {
    if (customer.id) {
      this.router.navigate([`/customers/edit/${customer.id}`]);
    }
  }

  // Action: Triggered when deleting a row
    onRowDelete(customerId: number) {
    if (confirm('Are you sure?')) {
      this.isLoading = true;
      this.customerService.deleteCustomer(customerId!).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err: any) => {
          console.error('Delete error', err);
          this.isLoading = false;
        }
      });
    }
  }

}
