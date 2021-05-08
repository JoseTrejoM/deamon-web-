import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../models/user.model';
import { LoginResponse } from '../models/loginresponse.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL_API: string = 'http://35.225.234.94:8080/api';

  constructor(private http: HttpClient) { }

  async createUsers(user: User) {
    return await this.http.post<User>(`${this.URL_API}/user/create`, user)
      .toPromise<User>();
  }

  async getCustomersAll() {
    return await this.http.get<User[]>(`${this.URL_API}/user/all`)
      .toPromise<User[]>();
  }

  async getusersById(idUsuario: number) {
    return await this.http.get<User>(`${this.URL_API}/user/byid/${idUsuario}`)
      .toPromise<User>();
  }

  async updateUsers(user: User) {
    return await this.http.put<User>(`${this.URL_API}/user/update`, user)
      .toPromise<User>();
  }

  async deleteUsers(idUsuario: number) {
    return await this.http.delete<User>(`${this.URL_API}/user/delete/${idUsuario}`)
      .toPromise<User>();
  }

  async userLogin(user: User) {
    return await this.http.post<LoginResponse>(`${this.URL_API}/user/login`, user).toPromise<LoginResponse>();
  }
}
