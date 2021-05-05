import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth.guard';
import { CustomerComponent } from './components/customer/customer.component';
import { InsuranceComponent } from './components/insurance/insurance.component';
import { UserComponent } from './components/user/user.component';


const APP_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'insurance', component: InsuranceComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
