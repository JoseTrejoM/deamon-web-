import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth.guard';
import { CustomerComponent } from './components/customer/customer.component';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { UserComponent } from './components/user/user.component';
import { MenubarComponent } from './components/menubar/menubar.component';


const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MenubarComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'home', component: HomeComponent, outlet: 'mod', canActivate: [AuthGuard] },
  { path: 'customer', component: CustomerComponent, outlet: 'mod', canActivate: [AuthGuard] },
  { path: 'insurance', component: InsuranceComponent, outlet: 'mod', canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, outlet: 'mod', canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
