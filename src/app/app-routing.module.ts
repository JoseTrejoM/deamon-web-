import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import {MODULE_ROUTES} from './components/home/module.routes';

import {AuthGuard} from './guards/auth.guard';


const APP_ROUTES: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, children: MODULE_ROUTES, canActivate: [AuthGuard], canActivateChild: [AuthGuard]},
  {path: '**', pathMatch: 'full', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
