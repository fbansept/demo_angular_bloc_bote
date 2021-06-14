import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Note} from '../../model/Note';
import {UtilisateurService} from '../../services/dao/utilisateur.service';
import {Utilisateur} from '../../model/Utilisateur';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NoteService} from '../../services/dao/note.service';
import {Role} from '../../model/Role';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit , OnDestroy {

  // @ts-ignore
  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;
  files: any[] = [];

  private souscription: Subscription | undefined = undefined;
  private utilisateurConnecte: Utilisateur | undefined = undefined;
  public listeNote: Note[] = [];
  public submitted = false;
  public focus = false;
  public ajoutFichier = false;
  public form: FormGroup = this.formBuilder.group({
    titre: [''],
    texte: ['']
  });

  constructor(
    private utilisateurService: UtilisateurService,
    private noteService: NoteService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.souscription = this.utilisateurService.utilisateurConnecte$.subscribe(
      (utilisateurConnecte: Utilisateur | undefined) => {
        if (utilisateurConnecte) {
          this.utilisateurConnecte = utilisateurConnecte;
          this.listeNote = utilisateurConnecte.listeNote;
        }
      },
      () => {},
      () => {},
    );

    this.utilisateurService.updateUtilisateur();
  }

  ngOnDestroy(): void {
    if (this.souscription) {
      this.souscription.unsubscribe();
    }
  }

  refresh(): void {
    this.utilisateurService.updateUtilisateur(true);
  }

  onClickHorsFormulaire(e: MouseEvent): void {
    this.ajoutNote();
  }

  ajoutNote(): void {

    if (this.focus && this.form?.controls.texte.value !== '' && this.utilisateurConnecte) {

      const note: Note = {
        id: undefined,
        titre: this.form?.controls.titre.value,
        editeur: this.utilisateurConnecte,
        texte: this.form?.controls.texte.value
      };

      if (this.files.length > 0) {
        this.noteService.ajoutNote(note, this.files[0]).subscribe(chemin => {
            this.utilisateurService.updateUtilisateur(true);
          },
          () => {
          },
          () => {
          }
        );
      } else {
        this.noteService.ajoutNote(note).subscribe(chemin => {
            this.utilisateurService.updateUtilisateur(true);
          },
          (e) => {
            console.log(e);
          },
          () => {
          }
        );
      }
    }
    this.focus = false;
    this.files = [];
    this.form.reset();
  }

  onClickFormulaire(e: MouseEvent): void {
    e.stopPropagation();
  }


  /**
   * on file drop handler
   */
  onFileDropped($event: any): void  {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(target: any): void  {
    this.prepareFilesList(target.files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number): void  {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number): void  {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
      console.log(item);
    }
    this.fileDropEl.nativeElement.value = '';
    // this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2): string  {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
