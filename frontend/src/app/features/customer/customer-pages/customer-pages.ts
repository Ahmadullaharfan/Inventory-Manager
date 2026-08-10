import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../customer-services/customer.service';
import { Customer } from '../customer-models/customer.model';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-customer-pages',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  templateUrl: './customer-pages.html',
  styleUrl: './customer-pages.css',
})
export class CustomerPages implements OnInit {
  // Inject dependencies using modern Angular inject syntax
  private customerService = inject(CustomerService);
  private router = inject(Router);

  // State management using Angular Signals to match your HTML template
  customers = signal<Customer[]>([]);
  isLoading = signal<boolean>(false);

  // Configuration for your app-data-table columns
  columns = [
    { key: 'id', label: 'ID' },
    { key: 'customer_name', label: 'Customer Name' },
    { key: 'father_name', label: "Father's Name" },
    { key: 'phone_number', label: 'Phone Number' },
    { key: 'email', label: 'Email' },
    { key: 'location', label: 'Location' },
    { key: 'attachment', label: 'Attachment' }
  ];

  ngOnInit(): void {
    this.loadCustomers();
  }

  // Fetch data from your Laravel backend API
  loadCustomers(): void {
    this.isLoading.set(true);
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch customers:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Action: Navigate to the creation form
  navigateToCreate(): void {
    this.router.navigate(['/Customers/create']);
  }

  // Action: Triggered when editing a row
  onRowEdit(customer: Customer): void {
    if (customer.id) {
      this.router.navigate([`/customers/edit/${customer.id}`]);
    }
  }

  // Action: Triggered when deleting a row
  onRowDelete(customer: Customer): void {
    if (!customer.id) return;

    const confirmDelete = confirm(`Are you sure you want to delete ${customer.customer_name}?`);
    if (confirmDelete) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          // Reactively remove the item from your Signal state array
          this.customers.update((prev) => prev.filter((c) => c.id !== customer.id));
        },
        error: (err) => console.error('Failed to delete customer:', err)
      });
    }
  }
}
