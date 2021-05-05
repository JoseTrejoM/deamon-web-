import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL_API: string = 'http://35.225.234.94:8080/api';

  constructor(private http: HttpClient) { }

  async getCustomersAll() {
    return await this.http.get<User[]>(`${this.URL_API}/user/all`)
      .toPromise<User[]>();
  }
}
