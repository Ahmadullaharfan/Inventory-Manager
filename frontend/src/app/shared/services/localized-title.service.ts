import { effect, inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { LocalizationService } from './localization.service';

@Injectable()
export class LocalizedTitleStrategy extends TitleStrategy {
  private title = inject(Title);
  private localization = inject(LocalizationService);
  private page = signal('Dashboard');
  constructor() {
    super();
    effect(() => this.title.setTitle(this.localization.text(this.page()) + ' | Inventory Manager'));
  }
  override updateTitle(snapshot: RouterStateSnapshot): void { this.page.set(this.buildTitle(snapshot) ?? 'Dashboard'); }
}
