import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Utilisateur } from '../../model/Utilisateur';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  public readonly utilisateurConnecte$: BehaviorSubject<Utilisateur | undefined> =
    new BehaviorSubject<Utilisateur| undefined>(undefined);

  constructor(private httpClient: HttpClient) {}

  public updateUtilisateur(force?: boolean): void {

    if (this.utilisateurConnecte$.value === undefined || force) {

      this.httpClient
              .get<Utilisateur>(environment.urlServer + 'user/utilisateur')
              .subscribe(
                (valeurRetourne: Utilisateur) => {
                  this.utilisateurConnecte$.next(valeurRetourne);
                },
                () => {},
                () => {}
              );
    }
  }
}
