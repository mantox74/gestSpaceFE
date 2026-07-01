export interface UserPayload {
  id: number;
  email: string;
  nome: string;
  cognome: string;
  ruolo: 'ADMIN' | 'OPERATORE';
}

export interface UserData {
  token: string;
  utente: UserPayload;
}
