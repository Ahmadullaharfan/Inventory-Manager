// product.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Simplified version - let the component handle the response
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`)
      .pipe(catchError(this.handleError));
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  createProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product)
      .pipe(catchError(this.handleError));
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product)
      .pipe(catchError(this.handleError));
  }

  createProductWithFormData(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, formData)
      .pipe(catchError(this.handleError));
  }

  updateProductWithFormData(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${id}?_method=PUT`, formData)
      .pipe(catchError(this.handleError));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Server returned code ${error.status}: ${error.message}`;
      if (error.error && typeof error.error === 'object') {
        console.error('Server error details:', error.error);
        if (error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
      }
    }
    
    console.error(errorMessage);
    return throwError(() => error);
  }
}