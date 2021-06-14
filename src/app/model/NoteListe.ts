import {Note} from './Note';
import {Tache} from './Tache';

export interface NoteListe extends Note {
  trierParEtat: boolean;
  listeTache: Tache[];
}
