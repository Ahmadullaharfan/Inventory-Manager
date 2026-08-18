import { Injectable } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreMediaService {
  currentMediaQuery: string;
  onMediaUpdate: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private _mediaObserver: MediaObserver) {
    this.currentMediaQuery = '';
    this._init();
  }

  private _init(): void {
    // ✅ FIX: Use asObservable() and map to get the first item from the array
    this._mediaObserver.asObservable().pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // Extract the first MediaChange from the array
      map((changes: MediaChange[]) => changes[0])
    ).subscribe((change: MediaChange) => {
      if (this.currentMediaQuery !== change.mqAlias) {
        this.currentMediaQuery = change.mqAlias;
        this.onMediaUpdate.next(change.mqAlias);
      }
    });
  }
}