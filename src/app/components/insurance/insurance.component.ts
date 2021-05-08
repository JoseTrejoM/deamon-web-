import { Component, OnInit } from '@angular/core';
import { Insurance } from 'src/app/models/insurance.model';
import { Customer } from 'src/app/models/customer.model';
import { InsuranceService } from 'src/app/services/insurance.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {

insurances: Insurance[] = [];
  constructor(private insuranceService: InsuranceService) { }

  ngOnInit(): void {
    this.getCustomersAll();
  }

  getCustomersAll() {
    this.insuranceService.getCustomersAll().then((data: Customer[])=>{
      let idx: number = 0;
      let today: Date = new Date();

      let insurancesTemp: Insurance[] = [];
      data.forEach((customer: Customer) => {
        idx++;
        let rand: number = Math.floor(Math.random() * 10) + 1;
        let auth: Insurance = new Insurance();
        auth.cliente = customer.nombre;
        auth.poliza = 'POL' + today.getFullYear() + '0000' + idx;
        auth.fecha = today;
        auth.formaPago = ((rand % 2) == 0) ? 'Efectivo' : 'TDC';
        auth.noAutorizacion = idx.toString();
        auth.periodoPago = ((rand % 2) == 0) ? 'Trimestral' : 'Mensual';
        insurancesTemp.push(auth);
      });
      this.insurances = insurancesTemp;

    });


  }

}
