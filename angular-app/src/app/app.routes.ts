import { Routes } from '@angular/router';
import { Index } from './features/Products/pages/index';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {path: "products", component: Index},
];
