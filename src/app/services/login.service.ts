import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/loginresponse.model';

import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private userService: UserService) { }

  getValidateLogin(user: User): Observable<LoginResponse> {
    return this.userService.userLogin(user).pipe(
      map(resp => {
      this.saveLoginData(resp);
      return resp;
    })/*,
    catchError(err =>{
      return throwError(err);
    })*/
  );
  }

  createUser(user: User): Observable<User> {
    return this.userService.createUsers(user);
  }

  private saveLoginData(loginResponse: LoginResponse) {
    localStorage.setItem('idToken', loginResponse.idToken ?.toString());
    localStorage.setItem('expiresIn', loginResponse.expiresIn ?.toString());
  }

  getLoginData(item: string): string | null {
    return localStorage.getItem(item);
  }

  hasLoginDataItem(item: string): boolean {
    return (!this.getLoginData(item)) ? false : true;
  }

  userHasSession(): boolean {
    let hasToken: boolean = this.hasLoginDataItem('idToken');
    let hasExpires: boolean = this.hasLoginDataItem('expiresIn');

    if (!(hasToken && hasExpires)) {
      return false;
    }

    let today: Date = new Date();
    let expireDate = new Date(Number(this.getLoginData('expiresIn')));
    return today < expireDate;

  }

  clearLoginData() {
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiresIn');
  }
}
