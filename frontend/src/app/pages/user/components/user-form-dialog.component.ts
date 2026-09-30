import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from '../module/user.module';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit user' : 'New user' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="grid gap-4">
        <mat-form-field appearance="outline">
          <mat-label>First name</mat-label>
          <input matInput formControlName="first_name" /> 
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last name</mat-label>
          <input matInput formControlName="last_name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="manager">Manager</mat-option>
            <mat-option value="user">User</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          Save
        </button>
      </mat-dialog-actions>
    </form>
  `,
})
export class UserFormDialogComponent {
  form: FormGroup;
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<UserFormDialogComponent, User | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User },
    fb: FormBuilder,
  ) {
    this.isEdit = !!data?.user;
    this.form = fb.group({
      first_name: [data?.user?.first_name ?? '', Validators.required],
      last_name:  [data?.user?.last_name  ?? '', Validators.required],
      email:      [data?.user?.email      ?? '', [Validators.required, Validators.email]],
      role:       [data?.user?.role       ?? 'user', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close({ ...this.data?.user, ...this.form.value } as User);
  }
}