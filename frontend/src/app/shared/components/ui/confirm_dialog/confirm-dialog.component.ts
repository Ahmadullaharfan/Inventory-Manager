import { LocalizePipe } from '../../../pipe/localize.pipe';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [LocalizePipe, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title | localize }}</h2>
    <mat-dialog-content>{{ data.message | localize }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close(false)">{{ (data.cancelText || 'Cancel') | localize }}</button>
      <button mat-flat-button [color]="data.confirmColor || 'primary'" (click)="close(true)">
        {{ (data.confirmText || 'Confirm') | localize }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
  ) {}
  close(result: boolean) { this.dialogRef.close(result); }
}