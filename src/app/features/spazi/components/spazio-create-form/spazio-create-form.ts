import { Component, inject, viewChild } from '@angular/core';
import { SpazioDTO } from '@app/features/spazi/model/spazi.model';
import { SpaziService } from '@app/features/spazi/service/spazi.service';
import { SpazioForm } from '@features/spazi/components/spazio-form/spazio-form';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-spazio-create-form',
  imports: [SpazioForm],
  template: '<app-spazio-form />',
})
export class SpazioCreateForm {
  private spaziService = inject(SpaziService);
  private form = viewChild.required(SpazioForm);

  salva(): Observable<SpazioDTO> | null {
    const payload = this.form().getPayload();
    return payload ? this.spaziService.creaSpazio(payload) : null;
  }

  isInvalid(): boolean {
    return this.form().isInvalid();
  }
}
