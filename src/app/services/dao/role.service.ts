import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Role } from 'src/app/model/Role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  public readonly listeRole$: BehaviorSubject<Role[]>;

  constructor(private httpClient: HttpClient) {
    this.listeRole$ = new BehaviorSubject<Role[]>([]);
  }

  public updateListeUtilisateur(force?: boolean): void {

    if (this.listeRole$.value.length === 0 || force) {

      this.httpClient
              .get<Role[]>(environment.urlServer + 'user/roles')
              .subscribe(
                (valeurRetourne: Role[]) => {
                  this.listeRole$.next(valeurRetourne);
                },
                () => {},
                () => {}
              );
    }
  }
}
