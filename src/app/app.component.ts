import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Utilisateur} from './model/Utilisateur';
import {UtilisateurService} from './services/dao/utilisateur.service';
import {AuthentificationService} from './services/security/authentification.service';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public utilisateurConnecte: Utilisateur | undefined;
  private souscription: Subscription | undefined = undefined;

  constructor(private utilisateurService: UtilisateurService,
              private authentificationService: AuthentificationService,
              private router: Router) { }

  ngOnInit(): void {

    this.souscription = this.utilisateurService.utilisateurConnecte$.subscribe(
      (utilisateurConnecte: Utilisateur | undefined) => {
          this.utilisateurConnecte = utilisateurConnecte;
      },
      () => {},
      () => {},
    );

    this.utilisateurService.updateUtilisateur();
  }

  onLogout(): void {
    this.authentificationService.logout();
    this.router.navigate(['login']);
  }
}
