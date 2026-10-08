import { LocalizePipe } from '../../../pipe/localize.pipe';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invoice-metrics',
  imports: [LocalizePipe,
    RouterModule,
  ],
  templateUrl: './invoice-metrics.component.html',
  styles: ``
})
export class InvoiceMetricsComponent {

}
