import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPages } from './customer-pages';

describe('CustomerPages', () => {
  let component: CustomerPages;
  let fixture: ComponentFixture<CustomerPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerPages],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerPages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
