import { Component, OnInit } from '@angular/core';
import { Insurance } from 'src/app/models/insurance.model';
import { Customer } from 'src/app/models/customer.model';
import { InsuranceService } from 'src/app/services/insurance.service';

import {formatDate} from '@angular/common';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {

insurances: Insurance[] = [];
columNames: any[] = [];

  constructor(private insuranceService: InsuranceService) { }

  ngOnInit(): void {
    this.columNames = [
      { field: 'cliente', header: 'Cliente', class: '', classParent: '' },
      { field: 'poliza', header: 'Poliza', class: '', classParent: '' },
      { field: 'noAutorizacion', header: 'No. autorizacion', class: 'p-d-none p-d-md-inline-flex', classParent: 'resizeColDown' },
      { field: 'fecha', header: 'Fecha', class: 'p-d-none p-d-md-inline-flex', classParent: 'resizeColDown' },
      { field: 'formaPago', header: 'Forma de pago', class: 'p-d-none p-d-md-inline-flex', classParent: 'resizeColDown' },
      { field: 'periodoPago', header: 'Periodo de pago', class: 'p-d-none p-d-md-inline-flex', classParent: 'resizeColDown' }
    ];
    this.getCustomersAll();
  }

  getCustomersAll() {
    this.insuranceService.getCustomersAll().subscribe((data: Customer[])=>{
      let idx: number = 0;
      let today: Date = new Date();

      let insurancesTemp: Insurance[] = [];
      data.forEach((customer: Customer) => {
        idx++;
        let rand: number = Math.floor(Math.random() * 10) + 1;
        let insurance: Insurance =  {
          cliente: customer.nombre,
          poliza: 'POL' + today.getFullYear() + '0000' + idx,
          noAutorizacion: idx.toString(),
          fecha: formatDate(today, 'dd/MM/yyyy', 'en-US'),
          formaPago: ((rand % 2) == 0) ? 'Efectivo' : 'TDC',
          periodoPago: ((rand % 2) == 0) ? 'Trimestral' : 'Mensual'
        }
        insurancesTemp.push(insurance);
      });
      this.insurances = insurancesTemp;

    },(err) => {
      console.log(err);
    });


  }

}
