import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

export const BS_BREAKPOINTS: Record<string, string> = {
  'bs-xs': '(max-width: 575.98px)',
  'bs-sm': '(min-width: 576px) and (max-width: 767.98px)',
  'bs-md': '(min-width: 768px) and (max-width: 991.98px)',
  'bs-lg': '(min-width: 992px) and (max-width: 1199.98px)',
  'bs-xl': '(min-width: 1200px)',
  'bs-gt-sm': '(min-width: 576px)',
  'bs-gt-md': '(min-width: 768px)',
  'bs-gt-lg': '(min-width: 992px)',
  'bs-gt-xl': '(min-width: 1200px)',
  'bs-lt-sm': '(max-width: 575.98px)',
  'bs-lt-md': '(max-width: 767.98px)',
  'bs-lt-lg': '(max-width: 991.98px)',
  'bs-lt-xl': '(max-width: 1199.98px)'
};

@Injectable({
  providedIn: 'root'
})
export class CoreMediaService {
  currentMediaQuery = '';
  onMediaUpdate: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private breakpointObserver: BreakpointObserver) {
    this._init();
  }

  isActive(aliasOrQuery: string): boolean {
    const query = BS_BREAKPOINTS[aliasOrQuery] ?? aliasOrQuery;
    return this.breakpointObserver.isMatched(query);
  }

  private _init(): void {
    const queries = Object.values(BS_BREAKPOINTS);
    this.breakpointObserver
      .observe(queries)
      .pipe(
        debounceTime(100),
        map(() => {
          const match = Object.entries(BS_BREAKPOINTS).find(([, query]) => this.breakpointObserver.isMatched(query));
          return match?.[0] ?? '';
        }),
        distinctUntilChanged()
      )
      .subscribe(alias => {
        this.currentMediaQuery = alias;
        this.onMediaUpdate.next(alias);
      });
  }
}
