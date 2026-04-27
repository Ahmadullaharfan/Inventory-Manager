import { Routes } from '@angular/router';
import { Index } from './features/Products/pages/index';
import { ProductFormComponent } from './features/Products/pages/product-form/product-form';
import { ProductCategoryListComponent } from './features/ProductCatagory/product-catagory/product-catagory';
import { ProductCategoryFormComponent } from './features/ProductCatagory/product-catagory/product-category-form/product-category-form';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: Index },
  { path: 'products/create', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },

  { path: 'productCategories', component: ProductCategoryListComponent },
  { path: 'productCategories/create', component: ProductCategoryFormComponent },
  { path: 'productCategories/edit/:id', component: ProductCategoryFormComponent }
];
