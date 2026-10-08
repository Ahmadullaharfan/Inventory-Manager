import { LocalizePipe } from '../../../pipe/localize.pipe';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User, userRoleDetails } from '../../../../pages/user/module/user.module';
import { ButtonComponent } from '../../ui/button/button.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
@Component({ selector: 'app-user-meta-card', standalone: true, imports: [LocalizePipe, ButtonComponent, BadgeComponent], templateUrl: './user-meta-card.component.html' })
export class UserMetaCardComponent { readonly roleDetails = userRoleDetails; @Input({required: true}) user!: User; @Input() canEdit = false; @Output() edit = new EventEmitter<void>(); }
