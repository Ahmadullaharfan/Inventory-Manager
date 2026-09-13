import { Component, OnInit, Input, ViewChild, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

import { CoreBlockUiComponent } from '@core/components/core-card/core-block-ui/core-block-ui.component';

@Component({
  selector: 'core-card',
  templateUrl: './core-card.component.html',
  standalone: false
})
export class CoreCardComponent implements OnInit {
  public coreCardId: string = Math.random().toString(36).substring(2);
  public _CoreBlockUiComponent = CoreBlockUiComponent;
  public blocked = false;

  public onclickEvent = {
    collapseStatus: false,
    expandStatus: false,
    reloadStatus: false,
    closeStatus: false
  };

  public actionsView = {
    collapse: false,
    expand: false,
    reload: false,
    close: false
  };

  @Input() actions: string[];
  @Input() isReload = false;
  @Input() reloadTime: number = 2500;
  @Output() events: EventEmitter<any>;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(_event: KeyboardEvent) {
    if (this.onclickEvent.expandStatus) {
      this.onclickEvent.expandStatus = false;
    }
  }

  @ViewChild('coreCard') private coreCard: ElementRef;
  @ViewChild('cardHeader') private cardHeader: ElementRef;

  constructor() {
    this.events = new EventEmitter<any>();
  }

  ngOnInit() {
    if (this.actions.includes('collapse')) {
      this.actionsView.collapse = true;
    }

    if (this.actions.includes('expand')) {
      this.actionsView.expand = true;
    }

    if (this.actions.includes('reload')) {
      this.actionsView.reload = true;
    }

    if (this.actions.includes('close')) {
      this.actionsView.close = true;
    }
  }

  ngOnChanges(changes: any) {
    if (changes.isReload?.currentValue === true) {
      this.events.emit('reload');
      this.blocked = true;
    } else if (changes.isReload?.currentValue === false) {
      this.blocked = false;
    }
  }

  collapse() {
    this.events.emit('collapse');
    const cardHeaderEl = this.cardHeader.nativeElement;
    this.onclickEvent.collapseStatus = !this.onclickEvent.collapseStatus;
    if (this.onclickEvent.collapseStatus) {
      setTimeout(() => {
        cardHeaderEl.classList.add('pb-2');
      }, 350);
    } else {
      cardHeaderEl.classList.remove('pb-2');
    }
  }

  expand() {
    this.events.emit('expand');
    this.onclickEvent.expandStatus = !this.onclickEvent.expandStatus;
  }

  close() {
    this.events.emit('close');
    this.coreCard.nativeElement.remove();
  }

  reload() {
    this.isReload = true;
    this.blocked = true;
    this.events.emit('reload');

    setTimeout(() => {
      this.blocked = false;
      this.isReload = false;
    }, this.reloadTime);
  }
}
