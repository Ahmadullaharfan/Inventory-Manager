import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';
import { CoreCardComponent } from '@core/components/core-card/core-card.component';
import { CoreBlockUiComponent } from '@core/components/core-card/core-block-ui/core-block-ui.component';

@NgModule({
  declarations: [CoreCardComponent, CoreBlockUiComponent],
  imports: [CommonModule, NgbModule, CoreCommonModule],
  exports: [CoreCardComponent]
})
export class CoreCardModule {}
