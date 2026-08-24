import { Component, inject, viewChild } from '@angular/core';
import { ClienteForm } from '@app/features/clienti/components/cliente-form/cliente-form';
import { ClienteDTO } from '@app/features/clienti/model/clienti.model';
import { ClientiService } from '@app/features/clienti/services/clienti.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-cliente-create-form',
  imports: [ClienteForm],
  template: '<app-cliente-form />',
})
export class ClienteCreateForm {
  private clientiService = inject(ClientiService);
  private form = viewChild.required(ClienteForm);

  salva(): Observable<ClienteDTO> | null {
    const payload = this.form().getPayload();
    return payload ? this.clientiService.creaCliente(payload) : null;
  }

  isInvalid(): boolean {
    return this.form().isInvalid();
  }
}
