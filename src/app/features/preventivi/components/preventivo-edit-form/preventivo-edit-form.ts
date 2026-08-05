import { Component, inject, input, viewChild } from '@angular/core';
import { PreventivoForm } from '@app/features/preventivi/components/preventivo-form/preventivo-form';
import { PreventivoDTO } from '@app/features/preventivi/model/preventivi';
import { PreventiviService } from '@app/features/preventivi/services/preventivi.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-preventivo-edit-form',
  imports: [PreventivoForm],
  template: '<app-preventivo-form [preventivo]="preventivo()" />',
})
export class PreventivoEditForm {
  private preventiviService = inject(PreventiviService);
  private form = viewChild.required(PreventivoForm);
  preventivo = input.required<PreventivoDTO>();

  salva(): Observable<PreventivoDTO> | null {
    const payload = this.form().getPayload();
    return payload
      ? this.preventiviService.modificaPreventivo(this.preventivo().id, payload)
      : null;
  }

  isInvalid(): boolean {
    return this.form().isInvalid();
  }
}
