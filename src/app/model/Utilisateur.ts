import {Role} from './Role';
import {Note} from './Note';

export interface Utilisateur {
  id: number | undefined;
  pseudo: string;
  motDePasse?: string;
  listeNote: Note [];
  listeRole: Role[];
}
