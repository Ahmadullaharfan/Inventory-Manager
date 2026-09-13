import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  OnDestroy,
  Optional
} from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';

export interface PerfectScrollbarConfigInterface {
  suppressScrollX?: boolean;
  suppressScrollY?: boolean;
  wheelPropagation?: boolean;
  swipeEasing?: boolean;
  minScrollbarLength?: number;
  maxScrollbarLength?: number;
  [key: string]: unknown;
}

export const PERFECT_SCROLLBAR_CONFIG = new InjectionToken<PerfectScrollbarConfigInterface>(
  'PERFECT_SCROLLBAR_CONFIG'
);

@Directive({
  selector: '[perfectScrollbar]',
  exportAs: 'ngxPerfectScrollbar',
  standalone: false
})
export class PerfectScrollbarDirective implements AfterViewInit, OnDestroy {
  @Input() perfectScrollbar: PerfectScrollbarConfigInterface | '' = '';

  private instance: PerfectScrollbar | null = null;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly ngZone: NgZone,
    @Optional() @Inject(PERFECT_SCROLLBAR_CONFIG) private readonly defaults: PerfectScrollbarConfigInterface | null
  ) {}

  ngAfterViewInit(): void {
    const config = {
      ...(this.defaults || {}),
      ...(typeof this.perfectScrollbar === 'object' ? this.perfectScrollbar : {})
    };

    this.ngZone.runOutsideAngular(() => {
      this.instance = new PerfectScrollbar(this.elementRef.nativeElement, config);
    });
  }

  ngOnDestroy(): void {
    this.instance?.destroy();
    this.instance = null;
  }

  update(): void {
    this.instance?.update();
  }

  position(_absolute?: boolean): { x: string | number; y: string | number } {
    const el = this.elementRef.nativeElement;
    return { x: el.scrollLeft, y: el.scrollTop };
  }

  scrollToElement(selector: string, offset = 0, _speed?: number): void {
    const host = this.elementRef.nativeElement;
    const target = host.querySelector<HTMLElement>(selector);
    if (!target) {
      return;
    }

    const hostRect = host.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    host.scrollTo({
      top: host.scrollTop + (targetRect.top - hostRect.top) + offset,
      behavior: 'smooth'
    });
  }
}

@NgModule({
  declarations: [PerfectScrollbarDirective],
  exports: [PerfectScrollbarDirective]
})
export class PerfectScrollbarModule {}
