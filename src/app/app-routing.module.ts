import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AccueilComponent} from './pages/accueil/accueil.component';
import {LoginComponent} from './pages/login/login.component';
import {RoleGuardService} from './services/security/role-guard.service';

const routes: Routes = [
  {path: '', component: AccueilComponent, canActivate: [RoleGuardService]},
  {path: 'accueil', component: AccueilComponent, canActivate: [RoleGuardService]},
  {path: 'login', component: LoginComponent},
  {path: '**', component: AccueilComponent, canActivate: [RoleGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
