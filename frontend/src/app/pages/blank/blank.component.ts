import { LocalizePipe } from '../../shared/pipe/localize.pipe';

import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-blank',
  imports: [LocalizePipe,
    PageBreadcrumbComponent
],
  templateUrl: './blank.component.html',
  styles: ``
})
export class BlankComponent {

}
