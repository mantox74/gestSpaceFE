import { Component, inject, viewChild } from '@angular/core';
import { PreventivoForm } from '@app/features/preventivi/components/preventivo-form/preventivo-form';
import { PreventivoDTO } from '@app/features/preventivi/model/preventivi';
import { PreventiviService } from '@app/features/preventivi/services/preventivi.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-preventivo-create-form',
  imports: [PreventivoForm],
  template: '<app-preventivo-form />',
})
export class PreventivoCreateForm {
  private preventiviService = inject(PreventiviService);
  private form = viewChild.required(PreventivoForm);

  salva(): Observable<PreventivoDTO> | null {
    const payload = this.form().getPayload();
    return payload ? this.preventiviService.creaPreventivo(payload) : null;
  }

  isInvalid(): boolean {
    return this.form().isInvalid();
  }
}
