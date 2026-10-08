import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Directionality } from '@angular/cdk/bidi';
import { LocalizationService } from './localization.service';
import { LocalizePipe } from '../pipe/localize.pipe';
import { LanguageSelectorComponent } from '../components/common/language-selector/language-selector.component';
import { SelectComponent } from '../components/form/select/select.component';
import { LocalizedPaginatorIntl } from './localized-paginator.service';

@Component({ standalone: true, imports: [LocalizePipe, LanguageSelectorComponent, SelectComponent], template: `
  <h1>{{ 'Users' | localize }}</h1>
  <p>{{ 'Delete {name}' | localize: { name: name } }}</p>
  <app-language-selector />
  <app-select [options]="options" [localizeOptions]="true" [value]="role" (valueChange)="role = $event" />
  <app-select [options]="options" [value]="role" />
` })
class LocalizationHost {
  name = 'Amina';
  role = 'admin';
  options = [{ value: 'admin', label: 'Admin' }];
}

describe('Application localization', () => {
  let saved: string | null;
  let savedDir: string | null;
  let savedLang: string;
  let documentDir: string;
  beforeEach(() => {
    saved = localStorage.getItem('locale'); savedDir = localStorage.getItem('dir'); savedLang = document.documentElement.lang; documentDir = document.documentElement.dir;
    localStorage.removeItem('locale'); localStorage.removeItem('dir');
    TestBed.configureTestingModule({ imports: [LocalizationHost], providers: [LocalizedPaginatorIntl] });
  });
  afterEach(() => {
    if (saved === null) localStorage.removeItem('locale'); else localStorage.setItem('locale', saved);
    if (savedDir === null) localStorage.removeItem('dir'); else localStorage.setItem('dir', savedDir);
    document.documentElement.lang = savedLang; document.documentElement.dir = documentDir;
  });
  it('offers only English, Pashto and Dari and restores the saved preference', () => {
    localStorage.setItem('locale', 'fa-AF');
    const service = TestBed.inject(LocalizationService);
    expect(service.languages.map(language => language.id)).toEqual(['en', 'ps', 'fa-AF']);
    expect(service.language()).toBe('fa-AF'); expect(document.documentElement.lang).toBe('fa-AF'); expect(document.documentElement.dir).toBe('rtl');
    expect(service.text('Users')).toBe('کاربران');
  });
  it('updates translated screen text and direction without changing data values', () => {
    const fixture = TestBed.createComponent(LocalizationHost); fixture.detectChanges();
    const service = TestBed.inject(LocalizationService);
    const selector = fixture.nativeElement.querySelector('app-language-selector select') as HTMLSelectElement;
    selector.value = 'ps'; selector.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('کارنان');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('Amina');
    expect(localStorage.getItem('locale')).toBe('ps'); expect(TestBed.inject(Directionality).value).toBe('rtl');
    const selects = fixture.nativeElement.querySelectorAll('app-select select') as NodeListOf<HTMLSelectElement>;
    expect(selects[0].value).toBe('admin'); expect(selects[0].selectedOptions[0].textContent).toContain('مدیر');
    expect(selects[1].selectedOptions[0].textContent).toContain('Admin');
    service.setLanguage('en'); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Users'); expect(document.documentElement.dir).toBe('ltr');
    expect(fixture.componentInstance.role).toBe('admin');
  });
  it('falls back to English for removed languages and untranslated data', () => {
    localStorage.setItem('locale', 'ar'); localStorage.setItem('dir', 'rtl');
    const service = TestBed.inject(LocalizationService);
    expect(service.language()).toBe('en'); expect(document.documentElement.dir).toBe('ltr');
    service.setLanguage('fa-AF'); expect(service.text('Inventory SKU 103')).toBe('Inventory SKU 103');
  });
  it('updates paginator labels and date formatting for Dari', () => {
    const service = TestBed.inject(LocalizationService); const paginator = TestBed.inject(LocalizedPaginatorIntl);
    service.setLanguage('fa-AF'); TestBed.tick();
    expect(paginator.nextPageLabel).toBe('صفحه بعد'); expect(paginator.getRangeLabel(0, 10, 25)).toContain('از');
    const date = '2026-10-08T08:00:00Z';
    expect(service.date(date)).toBe(new Intl.DateTimeFormat('fa-AF', { dateStyle: 'medium', timeStyle: 'short', calendar: 'gregory' }).format(new Date(date)));
    expect(service.date('invalid')).toBe('—');
  });
});
