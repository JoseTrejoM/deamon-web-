import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { LoginResponse } from '../models/loginresponse.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  URL_API: string = 'http://35.225.234.94:8080/api';

  constructor(private http: HttpClient) { }

  async getValidateLogin(user: UserModel) {
    return await this.http.post<LoginResponse>(`${this.URL_API}/user/login`, user).pipe(
      map((resp: LoginResponse) => {
        this.saveLoginData(resp);
        return resp;
      })
    ).toPromise<LoginResponse>();
  }

  async createUser(user: UserModel) {
    return await this.http.post<UserModel>(`${this.URL_API}/user/create`, user)
      .toPromise<UserModel>();
  }

  private saveLoginData(loginResponse: LoginResponse) {
    localStorage.setItem('idToken', loginResponse.idToken ?.toString());
    localStorage.setItem('expiresIn', loginResponse.expiresIn ?.toString());
  }

  getLoginData(data: string): string | null {
    return localStorage.getItem(data);
  }

  userHasSession(): boolean {
    let hasData: boolean = !(!this.getLoginData('idToken') && !this.getLoginData('expiresIn'));

    if (!hasData) {
      return false;
    }

    let today: Date = new Date();
    let expireDate = new Date(Number(this.getLoginData('expiresIn')));
    //console.log('today:: ' + today);
    //console.log('expireDate:: ' + expireDate);
    return today < expireDate;

  }

  clearLoginData() {
    localStorage.removeItem('idToken');
    localStorage.removeItem('expiresIn');
  }
}
