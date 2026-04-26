import { TestBed } from '@angular/core/testing';

import { ProductCategory } from './product-category';

describe('ProductCategory', () => {
  let service: ProductCategory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCategory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
