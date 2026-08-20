import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { Index } from './pages/index';
import { HomeComponent } from 'app/main/sample/home.component';
const routes = [
  {
    path: 'products',
    component: Index,
    data: { animation: 'sample' }
  },

  // {
  // path: '/products/create',
  //   component: ProductFormComponent,
  //   data: { animation: 'sample' }
  // },

  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'home' }
  }
];

@NgModule({
  declarations: [HomeComponent],
  imports: [RouterModule.forChild(routes), ContentHeaderModule, TranslateModule, CoreCommonModule, Index,],
  exports: [HomeComponent]
})
export class ProductModule {}
