import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductSuppliers } from '../models/product-supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private apiUrl = 'http://localhost:8000/api/suppliers';

  constructor(private http: HttpClient) {}

  // Get all suppliers
  getSuppliers(): Observable<ProductSuppliers[]> {
    return this.http
      .get<ProductSuppliers[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  // Get one supplier
  getSupplier(id: number): Observable<ProductSuppliers> {
    return this.http
      .get<ProductSuppliers>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Create supplier
  createSupplier(supplier: ProductSuppliers): Observable<ProductSuppliers> {
    return this.http
      .post<ProductSuppliers>(this.apiUrl, supplier)
      .pipe(catchError(this.handleError));
  }

  // Update supplier
  updateSupplier(id: number, supplier: ProductSuppliers): Observable<ProductSuppliers> {
    return this.http
      .put<ProductSuppliers>(`${this.apiUrl}/${id}`, supplier)
      .pipe(catchError(this.handleError));
  }

  // Delete supplier
  deleteSupplier(id: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred';

    if (
      typeof ErrorEvent !== 'undefined' &&
      error.error instanceof ErrorEvent
    ) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Server returned code ${error.status}: ${error.message}`;

      if (error.error) {
        console.error('Server response:', error.error);

        if (error.error.errors) {
          console.error('Validation Errors:', error.error.errors);
        }
      }
    }

    console.error(errorMessage);

    return throwError(() => error);
  }
}