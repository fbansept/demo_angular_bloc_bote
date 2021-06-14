import {Tache} from './Tache';
import {Utilisateur} from './Utilisateur';

export interface Note {
  id: number | undefined;
  titre: string;
  editeur: Utilisateur;

  trierParEtat?: boolean;
  listeTache?: Tache[];

  texte?: string;
  url?: string;
}
