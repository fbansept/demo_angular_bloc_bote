import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private lastRequest: any = null;
    /*private listeRequeteSansToken: string[] = [
      environment.urlServer + 'authentification',
      environment.urlServer + 'inscription'
    ];*/

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        console.log(this.lastRequest);
        this.lastRequest = req;

        const token = localStorage.getItem('token');

       /* // si la requete à besoin d'un token non expiré et qu'elle n'en a pas.
        if (this.listeRequeteSansToken.indexOf(req.url) !== -1 && (token == null || !this.tokenExpired(token))) {
            return throwError('token expired');
        }*/

        let cloned;

        if (token) {
            cloned = req.clone({
                setHeaders: {
                    Authorization:  'Bearer ' + token,
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        else {
            cloned = req.clone({
                setHeaders: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
        return next.handle(cloned);
    }

    private tokenExpired(token: string): boolean {
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
    }
}
