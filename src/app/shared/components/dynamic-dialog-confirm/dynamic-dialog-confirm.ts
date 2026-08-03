import { Component, SecurityContext, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export interface DynamicDialogConfirmData {
  title: string;
  text: string;
  closeLabel?: string;
  okLabel?: string;
}

@Component({
  selector: 'app-dynamic-dialog-confirm',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './dynamic-dialog-confirm.html',
  styleUrl: './dynamic-dialog-confirm.scss',
})
export class DynamicDialogConfirm {
  private dialogRef = inject(MatDialogRef<DynamicDialogConfirm, boolean>);
  private sanitizer = inject(DomSanitizer);
  data = inject<DynamicDialogConfirmData>(MAT_DIALOG_DATA);

  closeLabel = this.data.closeLabel ?? 'Chiudi';
  okLabel = this.data.okLabel ?? 'Ok';
  sanitizedText = this.sanitizer.sanitize(SecurityContext.HTML, this.data.text) ?? '';

  close(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
