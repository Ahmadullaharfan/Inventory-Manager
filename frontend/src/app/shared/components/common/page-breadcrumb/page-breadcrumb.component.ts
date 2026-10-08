import { LocalizePipe } from '../../../pipe/localize.pipe';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [LocalizePipe,
    RouterModule,
  ],
  templateUrl: './page-breadcrumb.component.html',
  styles: ``
})
export class PageBreadcrumbComponent {
  @Input() pageTitle = '';
}
