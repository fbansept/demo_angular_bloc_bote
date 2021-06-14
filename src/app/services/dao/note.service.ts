import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Note} from '../../model/Note';
import {catchError} from 'rxjs/operators';
import {AuthentificationService} from '../security/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(
    private httpClient: HttpClient, private authentificationService: AuthentificationService) {}

  public ajoutNote(note: any, file?: File): Observable<any> {

    if (note.texte) {

      if (file) {
        const formData: any = new FormData();
        note.editeur = {id: note.editeur.id};
        formData.append('note', JSON.stringify(note));
        formData.append('file', file);

        return this.httpClient.post(environment.urlServer + 'user/noteTexte-avec-fichier', formData, {
          reportProgress: true,
          observe: 'events'
        }).pipe(
          catchError(this.errorMgmt)
        );
      } else {
        this.authentificationService.logout();
        return this.httpClient
          .post<string>(environment.urlServer + 'user/noteTexte', note);
      }
    } else {
      return this.httpClient
        .post<string>(environment.urlServer + 'user/noteListe', note);
    }
  }

  errorMgmt(error: HttpErrorResponse): Observable<string> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
