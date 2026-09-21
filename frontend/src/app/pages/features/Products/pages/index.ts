import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, of } from 'rxjs';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';

import { ProductService } from '../../Products/services/product.service';
import { Product } from '../models/product.model';

/** Row model actually rendered in the table — adds display-only fields. */
export interface ProductRow extends Product {
  category_name: string;
  cost_price_display: string;
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule],
  templateUrl: './index.html',
  styleUrls: ['./index.css'],
})
export class Index implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  public ColumnMode = ColumnMode;

  @ViewChild('tableRowDetails') tableRowDetails: any;

  products: ProductRow[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadProducts();
  }

  rowDetailsToggleExpand(row: ProductRow): void {
    this.tableRowDetails?.rowDetail?.toggleExpandRow(row);
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService
      .getProducts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        map((response: unknown) => this.normalizeProducts(response)),
        map((products) => products.map((product) => this.toRowModel(product))),
        catchError((err) => {
          console.error('Error loading products', err);
          this.errorMessage = 'Could not load products. Please try again.';
          return of<ProductRow[]>([]);
        }),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((rows) => {
        this.products = rows;
      });
  }

  onRowEdit(product: ProductRow): void {
    this.router.navigate([`/products/edit/${product.id}`]);
  }

  onRowDelete(productId: number): void {
    if (!confirm('Are you sure?')) return;

    this.isLoading = true;

    this.productService
      .deleteProduct(productId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((err) => {
          console.error('Delete error', err);
          this.errorMessage = 'Could not delete the product. Please try again.';
          return of(null);
        }),
      )
      .subscribe(() => {
        if (!this.errorMessage) {
          this.loadProducts();
        }
      });
  }

  navigateToCreate(): void {
    this.router.navigate(['/products/create']);
  }

  private normalizeProducts(response: unknown): Product[] {
    if (Array.isArray(response)) return response as Product[];

    const data = (response as { data?: unknown } | null)?.data;
    if (Array.isArray(data)) return data as Product[];

    console.error('Unexpected products format:', response);
    return [];
  }

  private toRowModel(product: Product): ProductRow {
    return {
      ...product,
      category_name: product.category?.name ?? 'No Category',
      cost_price_display:
        product.cost_price != null ? `$${product.cost_price}` : '—',
    };
  }
}