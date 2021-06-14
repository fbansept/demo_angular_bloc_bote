import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Utilisateur } from 'src/app/model/Utilisateur';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject, } from 'rxjs';
// @ts-ignore
import * as jwt_decode from 'jwt-decode';
import { RoleService } from '../dao/role.service';
import { Role } from 'src/app/model/Role';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  public utilisateurConnecte$: BehaviorSubject<Utilisateur | undefined> =
    new BehaviorSubject<Utilisateur | undefined>(undefined);

  private listeRole: Role[] = [];
  private httpClient: HttpClient;

  constructor(handler: HttpBackend, roleService: RoleService) {
    this.httpClient = new HttpClient(handler);

    const token = localStorage.getItem('token');

    if (token != null) {
      const utilisateur = this.tokenToUtilisateur(token);
      this.utilisateurConnecte$.next(utilisateur);
    }

    roleService.listeRole$.subscribe(
      (listeRole: Role[]) => {
        this.listeRole = listeRole;
      }
    );
  }

  login(pseudo: string, motDePasse: string): Observable<Utilisateur> {

    return new Observable<Utilisateur>(observer => {

      this.httpClient
        .post(
          environment.urlServer + 'authentification',
          { pseudo, motDePasse },
          { responseType: 'text' })
        .subscribe((token: string) => {

          localStorage.setItem('token', token);

          const utilisateur = this.tokenToUtilisateur(token);
          this.utilisateurConnecte$.next(utilisateur);

          observer.next(utilisateur);
        });
    });
  }

  private tokenToUtilisateur(token: string): Utilisateur {
    const decodedToken: any = jwt_decode(token);

    const utilisateur: Utilisateur = {
      listeRole: [],
      listeNote: [],
      id: undefined,
      pseudo: decodedToken.sub
    };

    /*utilisateur.role =
    decodedToken.roles
        .split(',')
        .map(nomRole => this.listeRole
            .find(role => role.nom = nomRole));*/

    return utilisateur;
  }

  isLoggedIn(): boolean {
    console.log(this.utilisateurConnecte$.value);
    return this.utilisateurConnecte$.value !== undefined && this.utilisateurConnecte$.value.pseudo !== undefined;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.utilisateurConnecte$.next(undefined);
  }
}
