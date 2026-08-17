import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../customer-models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  // Replace with your actual Laravel API base URL
  private apiUrl = 'http://localhost:8000/api'; 

  constructor(private http: HttpClient) {}

  // GET /api/customers (Index)
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

 getCustomer(id: number): Observable<Customer> {
  return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`);
  }

  createCustomer(data: any): Observable<Customer> {
   return this.http.post<Customer>(`${this.apiUrl}/customers`, data);
  }

  updateCustomer(id: number, data: any): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customers/${id}`, data);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
