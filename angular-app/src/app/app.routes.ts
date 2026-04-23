import { Routes } from '@angular/router';
import { Index } from './features/Products/pages/index';
import { ProductFormComponent } from './features/Products/pages/product-form/product-form';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: "products", component: Index },
  { path: "products/create", component: ProductFormComponent },
  { path: "products/edit/:id", component: ProductFormComponent },
  {path: "products/delete/:id", component: ProductFormComponent }, 
  {path: "products/view/:id", component: ProductFormComponent}
];