import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../customer-models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // Replace with your actual Laravel API base URL
  private apiUrl = 'http://localhost:8000/api/customers'; 

  constructor(private http: HttpClient) {}

  // GET /api/customers (Index)
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  // GET /api/customers/{id} (Show)
  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}`);
  }

  // POST /api/customers (Store)
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer);
  }

  // PUT /api/customers/{id} (Update)
  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customer);
  }

  // DELETE /api/customers/{id} (Destroy)
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
