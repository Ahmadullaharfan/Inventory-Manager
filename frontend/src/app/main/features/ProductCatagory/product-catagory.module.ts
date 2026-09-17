import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ProductCategoryListComponent } from './product-catagory/product-catagory';
import { ProductCategoryFormComponent } from './product-catagory/product-category-form/product-category-form';
import { HomeComponent } from 'app/main/sample/home.component';
import '@angular/compiler';


const routes = [
  {
    path: 'productCatagory',
    component: ProductCategoryListComponent,
    data: { animation: 'sample' }
  },
  
  {
    path: 'productCatagory/create',
    component: ProductCategoryFormComponent,
    data: { animation: 'sample' }
  },

];

@NgModule({
  declarations: [HomeComponent],
  imports: [RouterModule.forChild(routes), ContentHeaderModule, TranslateModule, CoreCommonModule, ProductCategoryListComponent, ProductCategoryFormComponent,],
  exports: [HomeComponent]
})
export class ProductCatagoryModule {}