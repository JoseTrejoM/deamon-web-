import { Injectable } from '@angular/core';
import { CustomerService } from './customer.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  //URL_API: string = 'http://35.225.234.94:8080/api';

  constructor(private customerService: CustomerService) { }

  async getCustomersAll() {
    return await this.customerService.getCustomersAll();
  }
}
