import { Injectable, Injector } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

export interface Locale {
  lang: string;
  data: Object;
}

@Injectable({
  providedIn: 'root'
})
export class CoreTranslationService {
  private _translateService: TranslateService;

  /**
   * Constructor
   *
   * @param {Injector} _injector
   */
  constructor(private _injector: Injector) {}

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Translate
   *
   * @param {Locale} args
   */
  translate(...args: Locale[]): void {
    const locales = [...args];

    // Lazily resolve TranslateService to avoid early DI during app bootstrap
    if (!this._translateService) {
      this._translateService = this._injector.get(TranslateService);
    }

    locales.forEach(locale => {
      // use setTranslation() with the third argument value as true to append translations instead of replacing them
      this._translateService.setTranslation(locale.lang, locale.data, true);
    });
  }
}
