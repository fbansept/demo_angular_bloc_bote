import {Note} from './Note';
import {Tache} from './Tache';

export interface NoteTexte extends Note {
  texte: string;
  url: string;
}
