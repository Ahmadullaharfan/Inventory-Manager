import { LocalizePipe } from '../../../pipe/localize.pipe';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserAddress } from '../../../../pages/user/module/user.module';
import { ButtonComponent } from '../../ui/button/button.component';
import { BadgeComponent } from '../../ui/badge/badge.component';
@Component({ selector: 'app-user-address-card', standalone: true, imports: [LocalizePipe, ButtonComponent, BadgeComponent], templateUrl: './user-address-card.component.html' })
export class UserAddressCardComponent { @Input() addresses: UserAddress[] = []; @Input() canEdit = false; @Output() edit = new EventEmitter<void>(); }
