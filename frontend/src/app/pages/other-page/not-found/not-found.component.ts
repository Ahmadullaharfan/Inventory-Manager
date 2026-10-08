import { LocalizePipe } from '../../../shared/pipe/localize.pipe';
import { Component } from '@angular/core';
import { GridShapeComponent } from '../../../shared/components/common/grid-shape/grid-shape.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [LocalizePipe,
    GridShapeComponent,
    RouterModule,
  ],
  templateUrl: './not-found.component.html',
  styles: ``
})
export class NotFoundComponent {

  currentYear: number = new Date().getFullYear();
}
