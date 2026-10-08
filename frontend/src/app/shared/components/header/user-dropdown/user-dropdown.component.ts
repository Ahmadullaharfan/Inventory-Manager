import { LocalizePipe } from '../../../pipe/localize.pipe';
import { AuthService } from '../../../services/auth.service';
import { LocalizationService } from '../../../services/localization.service';
import { LanguageSelectorComponent } from '../../common/language-selector/language-selector.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { apiError } from '../../../../pages/user/service/user.service';
import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({ selector: 'app-user-dropdown', standalone: true, templateUrl: './user-dropdown.component.html', imports: [LocalizePipe, CommonModule, RouterModule, LanguageSelectorComponent] })
export class UserDropdownComponent {
  readonly auth = inject(AuthService);
  readonly localization = inject(LocalizationService);
  private snack = inject(MatSnackBar);
  private elementRef = inject(ElementRef);
  isOpen = false;
  signOut(): void { this.auth.logout().subscribe({ next: () => this.closeDropdown(), error: error => this.snack.open(this.localization.text(apiError(error)), this.localization.text('Close'), { duration: 5000 }) }); }
  toggleDropdown(event?: Event): void { event?.stopPropagation(); this.isOpen = !this.isOpen; }
  closeDropdown(): void { this.isOpen = false; }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) this.closeDropdown();
  }
}
