import { Component, inject, input, viewChild } from '@angular/core';
import { SpazioDTO } from '@app/features/spazi/model/spazi.model';
import { SpaziService } from '@app/features/spazi/service/spazi.service';
import { SpazioForm } from '@features/spazi/components/spazio-form/spazio-form';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-spazio-edit-form',
  imports: [SpazioForm],
  template: '<app-spazio-form [spazio]="spazio()" [showStato]="true" />',
})
export class SpazioEditForm {
  private spaziService = inject(SpaziService);
  private form = viewChild.required(SpazioForm);
  spazio = input.required<SpazioDTO>();

  salva(): Observable<SpazioDTO> | null {
    const payload = this.form().getPayload();
    return payload ? this.spaziService.modificaSpazio(this.spazio().id, payload) : null;
  }

  isInvalid(): boolean {
    return this.form().isInvalid();
  }
}
