import { LocalizationService } from '../../../services/localization.service';
import { LocalizePipe } from '../../../pipe/localize.pipe';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { apiError } from '../../../../pages/user/service/user.service';
@Component({ selector: 'app-signin-form', standalone: true, imports: [LocalizePipe, FormsModule, RouterModule, LabelComponent, InputFieldComponent, ButtonComponent], templateUrl: './signin-form.component.html' })
export class SigninFormComponent {
  readonly localization = inject(LocalizationService);
  private auth = inject(AuthService); private router = inject(Router); private route = inject(ActivatedRoute);
  readonly busy = signal(false); readonly error = signal(''); readonly needsCode = signal(false);
  email = ''; password = ''; code = ''; isChecked = false; showPassword = false;
  togglePasswordVisibility() { this.showPassword = !this.showPassword; }
  onSignIn() {
    if (this.busy()) return;
    if (!this.email || !this.password) { this.error.set('Enter your email and password.'); return; }
    this.busy.set(true); this.error.set('');
    this.auth.login({email: this.email, password: this.password, remember: this.isChecked, ...(this.code ? {code: this.code} : {})}).subscribe({ next: () => { this.busy.set(false); this.password = ''; this.code = ''; const target = this.route.snapshot.queryParamMap.get('returnUrl'); void this.router.navigateByUrl(target && /^\/(?!\/)/.test(target) ? target : '/profile'); }, error: error => { this.busy.set(false); this.error.set(apiError(error, this.localization)); if (error.error?.errors?.code) this.needsCode.set(true); } });
  }
}
