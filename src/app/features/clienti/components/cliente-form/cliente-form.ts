import { Component, effect, input, signal, untracked } from '@angular/core';
import { disabled, form, FormField, required, validate } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClienteDTO, ClientePayload } from '@app/features/clienti/model/clienti.model';

type ClienteFormValue = Record<keyof ClientePayload, string>;

const initialValue: ClienteFormValue = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  indirizzo: '',
  numero_civico: '',
  cap: '',
  citta: '',
  provincia: '',
  codice_fiscale: '',
  p_iva: '',
};

@Component({
  selector: 'app-cliente-form',
  imports: [FormField, MatFormFieldModule, MatInputModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.scss',
})
export class ClienteForm {
  cliente = input<ClienteDTO | null>(null);
  isReadonly = input(false);

  formModel = signal<ClienteFormValue>({ ...initialValue });
  clienteForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.nome, { message: 'Il nome è obbligatorio' });
    required(schemaPath.cognome, { message: 'Il cognome è obbligatorio' });
    required(schemaPath.email, { message: "L'email è obbligatoria" });
    validate(schemaPath.codice_fiscale, ({ value }) => {
      if (this.hasTaxIdentifier(value(), this.formModel().p_iva)) {
        return null;
      }

      return {
        kind: 'taxIdentifierRequired',
        message: 'Inserisci il codice fiscale oppure la partita IVA',
      };
    });
    validate(schemaPath.p_iva, ({ value }) => {
      if (this.hasTaxIdentifier(this.formModel().codice_fiscale, value())) {
        return null;
      }

      return {
        kind: 'taxIdentifierRequired',
        message: 'Inserisci la partita IVA oppure il codice fiscale',
      };
    });

    const formKeys = Object.keys(this.formModel()) as Array<keyof ClienteFormValue>;
    formKeys.forEach((key) => {
      disabled(schemaPath[key], {
        when: () => this.isReadonly(),
      });
    });
  });

  constructor() {
    effect(() => {
      const cliente = this.cliente();
      untracked(() => {
        this.clienteForm().value.set(cliente ? this.toFormValue(cliente) : { ...initialValue });
      });
    });
  }

  getPayload(): ClientePayload | null {
    if (this.clienteForm().invalid()) {
      return null;
    }

    const value = this.clienteForm().value();

    return {
      nome: value.nome.trim(),
      cognome: value.cognome.trim(),
      email: this.toNullableString(value.email),
      telefono: this.toNullableString(value.telefono),
      indirizzo: this.toNullableString(value.indirizzo),
      numero_civico: this.toNullableString(value.numero_civico),
      cap: this.toNullableString(value.cap),
      citta: this.toNullableString(value.citta),
      provincia: this.toNullableString(value.provincia),
      codice_fiscale: this.toNullableString(value.codice_fiscale),
      p_iva: this.toNullableString(value.p_iva),
    };
  }

  isInvalid(): boolean {
    return this.clienteForm().invalid();
  }

  private toFormValue(cliente: ClienteDTO): ClienteFormValue {
    return {
      nome: cliente.nome ?? '',
      cognome: cliente.cognome ?? '',
      email: cliente.email ?? '',
      telefono: cliente.telefono ?? '',
      indirizzo: cliente.indirizzo ?? '',
      numero_civico: cliente.numero_civico ?? '',
      cap: cliente.cap ?? '',
      citta: cliente.citta ?? '',
      provincia: cliente.provincia ?? '',
      codice_fiscale: cliente.codice_fiscale ?? '',
      p_iva: cliente.p_iva ?? '',
    };
  }

  private toNullableString(value: string): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = value.trim();
    return normalized ? normalized : null;
  }

  private hasTaxIdentifier(codiceFiscale: string, partitaIva: string): boolean {
    return codiceFiscale.trim().length > 0 || partitaIva.trim().length > 0;
  }
}
