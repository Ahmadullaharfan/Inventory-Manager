import { LocalizePipe } from '../../../../pipe/localize.pipe';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalComponent } from '../../../ui/modal/modal.component';
import { ComponentCardComponent } from '../../../common/component-card/component-card.component';
import { ButtonComponent } from '../../../ui/button/button.component';

@Component({
  selector: 'app-full-screen-modal',
  imports: [LocalizePipe,
    CommonModule,
    ModalComponent,
    ComponentCardComponent,
    ButtonComponent
  ],
  templateUrl: './full-screen-modal.component.html',
  styles: ``
})
export class FullScreenModalComponent {

  isOpen = false;

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  handleSave() {
    console.log('Saving changes...');
    this.closeModal();
  }
}
