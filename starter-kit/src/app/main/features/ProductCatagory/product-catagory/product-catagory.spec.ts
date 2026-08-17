import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatagory } from './product-catagory';

describe('ProductCatagory', () => {
  let component: ProductCatagory;
  let fixture: ComponentFixture<ProductCatagory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCatagory],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCatagory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
