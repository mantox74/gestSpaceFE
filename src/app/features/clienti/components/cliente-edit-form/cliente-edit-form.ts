import { Component, inject, input, viewChild } from '@angular/core';
import { ClienteForm } from '@app/features/clienti/components/cliente-form/cliente-form';
import { ClienteDTO } from '@app/features/clienti/model/clienti.model';
import { ClientiService } from '@app/features/clienti/services/clienti.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-cliente-edit-form',
  imports: [ClienteForm],
  template: '<app-cliente-form [cliente]="cliente()" [isReadonly]="isReadonly()" />',
})
export class ClienteEditForm {
  private clientiService = inject(ClientiService);
  private form = viewChild.required(ClienteForm);
  cliente = input.required<ClienteDTO>();
  isReadonly = input(false);

  salva(): Observable<ClienteDTO> | null {
    const payload = this.form().getPayload();
    return payload ? this.clientiService.modificaCliente(this.cliente().id, payload) : null;
  }

  isInvalid(): boolean {
    return this.form().isInvalid();
  }
}
