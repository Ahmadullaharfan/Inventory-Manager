import { LocalizePipe } from '../../../pipe/localize.pipe';

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-component-card',
  imports: [LocalizePipe, ButtonComponent],
  templateUrl: './component-card.component.html',
  styles: ``
})
export class ComponentCardComponent {
  @Input() title!: string;
  @Input() buttonTitle: string = 'Add';
  @Input() className: string = '';
  @Input() addbutton:boolean=false;

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick(){
    this.buttonClick.emit();
  }
}
