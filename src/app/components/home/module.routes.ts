import { Routes } from '@angular/router';

import {CustomerComponent} from '../customer/customer.component';

export const MODULE_ROUTES: Routes = [
  { path: 'customer', component: CustomerComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];
