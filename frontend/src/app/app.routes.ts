import { Routes } from '@angular/router';

import { HomeComponent } from './main/sample/home.component';
import { Index } from './main/features/Products/pages/index';
import { ProductForm } from './main/features/Products/pages/product-form/product-form';

export const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' }
  },
  {
    path: 'products',
    component: Index,
    data: { animation: 'sample' }
  },
  {
    path: 'products/create',
    component: ProductForm,
    data: { animation: 'sample' }
  },
  {
    path: 'products/edit/:id',
    component: ProductForm,
    data: { animation: 'sample' }
  },
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'productCatagory',
    loadChildren: () =>
      import('./main/features/ProductCatagory/product-catagory.routes').then(m => m.PRODUCT_CATEGORY_ROUTES)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error'
  }
];
