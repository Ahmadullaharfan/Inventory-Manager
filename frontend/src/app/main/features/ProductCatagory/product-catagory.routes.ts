import { Routes } from '@angular/router';

import { ProductCategoryListComponent } from './product-catagory/product-catagory';
import { ProductCategoryFormComponent } from './product-catagory/product-category-form/product-category-form';

export const PRODUCT_CATEGORY_ROUTES: Routes = [
  {
    path: '',
    component: ProductCategoryListComponent,
    data: { animation: 'sample' }
  },
  {
    path: 'create',
    component: ProductCategoryFormComponent,
    data: { animation: 'sample' }
  },
  {
    path: 'edit/:id',
    component: ProductCategoryFormComponent,
    data: { animation: 'sample' }
  }
];
