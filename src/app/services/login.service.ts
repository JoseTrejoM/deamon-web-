import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/loginresponse.model';

//import { map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  URL_API: string = 'http://35.225.234.94:8080/api';

  constructor(private userService: UserService) { }

  async getValidateLogin(user: User) {
    return await this.userService.userLogin(user).then(
      (resp: LoginResponse) => {
        this.saveLoginData(resp);
        return resp;
      }
    );
  }

  async createUser(user: User) {
    return await this.userService.createUsers(user);
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
