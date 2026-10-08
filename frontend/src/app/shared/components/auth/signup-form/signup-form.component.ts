import { LocalizationService } from '../../../services/localization.service';
import { LocalizePipe } from '../../../pipe/localize.pipe';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { apiError } from '../../../../pages/user/service/user.service';
@Component({ selector: 'app-signup-form', standalone: true, imports: [LocalizePipe, FormsModule, RouterModule, LabelComponent, InputFieldComponent, ButtonComponent], templateUrl: './signup-form.component.html' })
export class SignupFormComponent {
  readonly localization = inject(LocalizationService);
  private auth = inject(AuthService); private router = inject(Router);
  readonly busy = signal(false); readonly error = signal('');
  fname = ''; lname = ''; email = ''; password = ''; confirmation = '';
  onSignUp() {
    if (this.busy()) return;
    if (!this.fname.trim() || !this.lname.trim() || !this.email || this.password.length < 8 || this.password !== this.confirmation) { this.error.set('Complete all fields and use matching passwords of at least 8 characters.'); return; }
    this.busy.set(true); this.error.set('');
    this.auth.register({first_name: this.fname.trim(), last_name: this.lname.trim(), email: this.email, password: this.password, password_confirmation: this.confirmation}).subscribe({next: () => { this.busy.set(false); this.password = ''; this.confirmation = ''; void this.router.navigate(['/profile']); }, error: error => { this.busy.set(false); this.error.set(apiError(error, this.localization)); }});
  }
}
