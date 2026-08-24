import { Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ClienteDTO } from '@app/features/clienti/model/clienti.model';

type DetailItem = {
  label: string;
  value: string | number | null | undefined;
};

@Component({
  selector: 'app-cliente-detail',
  imports: [MatChipsModule, MatIconModule],
  templateUrl: './cliente-detail.html',
  styleUrl: './cliente-detail.scss',
})
export class ClienteDetail {
  cliente = input.required<ClienteDTO>();

  nominativo = computed(() => `${this.cliente().cognome} ${this.cliente().nome}`.trim());

  contatti = computed<DetailItem[]>(() => [
    { label: 'Email', value: this.cliente().email },
    { label: 'Telefono', value: this.cliente().telefono },
  ]);

  fiscali = computed<DetailItem[]>(() => [
    { label: 'Codice fiscale', value: this.cliente().codice_fiscale },
    { label: 'Partita IVA', value: this.cliente().p_iva },
  ]);

  indirizzo = computed(() => {
    const cliente = this.cliente();
    return [cliente.indirizzo, cliente.numero_civico, cliente.cap, cliente.citta, cliente.provincia]
      .filter(Boolean)
      .join(' ');
  });
}
