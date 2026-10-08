import { DOCUMENT } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import { computed, inject, Injectable, signal } from '@angular/core';
import { translations } from '../localization/translations';

export type LanguageCode = 'en' | 'ps' | 'fa-AF';
export const languages: readonly { id: LanguageCode; name: string; locale: string; direction: 'ltr' | 'rtl' }[] = [
  { id: 'en', name: 'English', locale: 'en-US', direction: 'ltr' },
  { id: 'ps', name: 'پښتو', locale: 'ps-AF', direction: 'rtl' },
  { id: 'fa-AF', name: 'دری', locale: 'fa-AF', direction: 'rtl' },
];
const normalize = (text: string): string => text.replace(/\s+/g, ' ').trim().toLowerCase();
const indexMessages = (dictionary: Readonly<Record<string, string>>): ReadonlyMap<string, string> =>
  new Map(Object.entries(dictionary).map(([source, translated]) => [normalize(source), translated]));
const messages = {
  ps: indexMessages(translations.ps),
  'fa-AF': indexMessages(translations['fa-AF']),
};

@Injectable({ providedIn: 'root' })
export class LocalizationService {
  private document = inject(DOCUMENT);
  private bidi = inject(Directionality);
  readonly languages = languages;
  private selected = signal<LanguageCode>('en');
  readonly language = this.selected.asReadonly();
  readonly current = computed(() => languages.find(language => language.id === this.selected())!);
  readonly direction = computed(() => this.current().direction);
  readonly locale = computed(() => this.current().locale);

  constructor() {
    let saved: string | null = null;
    try { saved = this.document.defaultView?.localStorage.getItem('locale') ?? null; } catch { /* Storage may be disabled by the browser. */ }
    this.setLanguage(saved ?? 'en');
  }

  setLanguage(code: string): void {
    const language = languages.find(language => language.id === code) ?? languages[0];
    this.selected.set(language.id);
    this.document.documentElement.lang = language.locale;
    this.document.documentElement.dir = language.direction;
    this.bidi.valueSignal.set(language.direction);
    this.bidi.change.emit(language.direction);
    try {
      this.document.defaultView?.localStorage.setItem('locale', language.id);
      this.document.defaultView?.localStorage.setItem('dir', language.direction);
    } catch { /* Language switching also works without persistent storage. */ }
  }

  text(source: string | null | undefined, parameters: Record<string, string | number> = {}): string {
    if (!source) return '';
    const language = this.language();
    let translated = language === 'en' ? source : messages[language].get(normalize(source)) ?? source;
    for (const [key, value] of Object.entries(parameters)) translated = translated.replaceAll('{' + key + '}', String(value));
    return translated;
  }

  number(value: number): string { return new Intl.NumberFormat(this.locale()).format(value); }
  date(value: string | number | Date | null | undefined): string {
    if (value == null || value === '') return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(this.locale(), { dateStyle: 'medium', timeStyle: 'short', calendar: 'gregory' }).format(date);
  }
}
