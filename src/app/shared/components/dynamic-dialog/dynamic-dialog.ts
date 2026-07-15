import { Component, Type, ViewContainerRef, inject, signal, viewChild } from '@angular/core';
import { MatButtonAppearance, MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export type DynamicDialogActionAppearance = 'filled' | 'outlined' | 'text';

export interface DynamicDialogAction<TComponent = unknown> {
  label: string;
  icon?: string;
  appearance?: DynamicDialogActionAppearance;
  closesDialog?: boolean;
  disabled?: (component: TComponent | null) => boolean;
  action?: (component: TComponent | null, dialogRef: MatDialogRef<DynamicDialog>) => void;
}

export interface DynamicDialogData<TComponent = unknown> {
  title: string;
  description?: string;
  component: Type<TComponent>;
  componentInputs?: Record<string, unknown>;
  actions?: DynamicDialogAction<TComponent>[];
}

@Component({
  selector: 'app-dynamic-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './dynamic-dialog.html',
  styleUrl: './dynamic-dialog.scss',
})
export class DynamicDialog<TComponent = unknown> {
  private dialogRef = inject(MatDialogRef<DynamicDialog>);
  data = inject<DynamicDialogData<TComponent>>(MAT_DIALOG_DATA);
  contentHost = viewChild.required('contentHost', { read: ViewContainerRef });
  componentInstance = signal<TComponent | null>(null);

  ngAfterViewInit(): void {
    const componentRef = this.contentHost().createComponent(this.data.component);

    for (const [key, value] of Object.entries(this.data.componentInputs ?? {})) {
      componentRef.setInput(key, value);
    }

    this.componentInstance.set(componentRef.instance);
    componentRef.changeDetectorRef.detectChanges();
  }

  runAction(action: DynamicDialogAction<TComponent>): void {
    action.action?.(this.componentInstance(), this.dialogRef);

    if (action.closesDialog) {
      this.dialogRef.close();
    }
  }

  isActionDisabled(action: DynamicDialogAction<TComponent>): boolean {
    return action.disabled?.(this.componentInstance()) ?? false;
  }

  buttonAttribute(action: DynamicDialogAction<TComponent>): MatButtonAppearance {
    return action.appearance ?? 'text';
  }
}
