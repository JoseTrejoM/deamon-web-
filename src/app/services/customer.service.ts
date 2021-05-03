import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  URL_API: string = 'http://35.225.234.94:8080/api';

  constructor(private http: HttpClient) {
  }

  async createCustomers(customer: Customer) {
    return await this.http.post<Customer>(`${this.URL_API}/client/create`, customer)
      .toPromise<Customer>();
  }

  async getCustomersAll() {
    return await this.http.get<Customer[]>(`${this.URL_API}/client/all`)
      .toPromise<Customer[]>();
  }

  async getCustomersById(idCliente: number) {
    return await this.http.get<Customer>(`${this.URL_API}/client/byid/${idCliente}`)
      .toPromise<Customer>();
  }

  async updateCustomers(customer: Customer) {
    return await this.http.put<Customer>(`${this.URL_API}/client/update`, customer)
      .toPromise<Customer>();
  }

  async deleteCustomers(idCliente: number) {
    return await this.http.delete<Customer>(`${this.URL_API}/client/delete/${idCliente}`)
      .toPromise<Customer>();
  }
}
