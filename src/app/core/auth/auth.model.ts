export interface UserPayload {
  nome: string;
  cognome: string;
  ruolo: 'ADMIN' | 'OPERATORE';
  stato: string;
}

export interface UserData extends UserPayload {
  id: number;
  token: string;
}
