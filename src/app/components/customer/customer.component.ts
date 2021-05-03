import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CustomerComponent implements OnInit {

  customers: Customer[] = [];
  customer: Customer = new Customer();
  columNames: any[] = [];

  submitted: boolean = false;
  customerDialog: boolean = false;
  showLoading: boolean = false;

  constructor(private customerService: CustomerService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.columNames = [
      { field: 'nombre', header: 'Nombre' },
      { field: 'curp', header: 'CURP' },
      { field: 'fechaNac', header: 'Fecha de nacimiento' },
      { field: 'sexo', header: 'Sexo' }
    ];

    this.getCustomersAll();
  }

  getCustomersAll(){
    this.customerService.getCustomersAll().then((data: Customer[]) => {
      data.forEach(customer => {
        customer.fechaNac = new Date(customer.fechaNac);
        customer.fechanacimiento = this.parseDayOrMoth(customer.fechaNac.getDate()) + "/" + this.parseDayOrMoth(customer.fechaNac.getMonth() + 1) + "/" + customer.fechaNac.getFullYear();
      });

      this.customers = data;
    }).catch(err => {
      console.log(err);
    });
  }

  parseDayOrMoth (dayOrMoth: number) : string{
    if(dayOrMoth < 10){
      return '0' + dayOrMoth;
    }
    return '' + dayOrMoth;
  }

  openNew() {
    this.customer = new Customer();
    this.customer.sexo = 'M';
    this.submitted = false;
    this.customerDialog = true;
  }

  hideDialog() {
    this.customerDialog = false;
    this.submitted = false;
  }

  editCustomer(customer: Customer) {
    this.customer = { ...customer };
    this.customer.fechaNac = new Date(customer.fechaNac);
    this.customerDialog = true;
  }

  deleteCustomer(customer: Customer) {
    //console.log(customer);
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar a ' + customer.nombre + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.showLoading = true;
        this.customerService.deleteCustomers(customer.idCliente).then((data: Customer) => {
          this.showLoading = false;
          this.customers = this.customers.filter(val => val.idCliente !== customer.idCliente);
          this.customer = new Customer();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: data.nombre + ' cliente eliminado ', life: 3000 });
        }).catch(err => {
          this.showLoading = false;
        });
      }
    });
  }

  saveOrUpdateCustomer() {
    if(!this.customer.nombre || !this.customer.curp || !this.customer.fechanacimiento || !this.customer.sexo){
      return;
    }
    let intDate: string[] = this.customer.fechanacimiento.split('/');
    this.customer.fechaNac = new Date(Number(intDate[2]), Number(intDate[1]) - 1, Number(intDate[0]));

    this.submitted = true;
    if (this.customer.nombre.trim()) {
      this.showLoading = true;
      if (this.customer.idCliente && this.customer.idCliente > 0) {
        this.updateCustomer(this.customer);
      } else {
        this.createCustomer(this.customer);
      }
      this.showLoading = false;
    }
  }

  private createCustomer(customer: Customer) {
    this.customerService.createCustomers(customer).then((data: Customer) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente creado', life: 3000 });

      this.customers.push(data);
      this.customerDialog = false;
      this.customer = new Customer();
    });
  }

  private updateCustomer(customer: Customer) {
    this.customerService.updateCustomers(customer).then((data: Customer) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente actualizado', life: 3000 });

      this.customers[this.findIndexById(data.idCliente)] = data;
      this.customerDialog = false;
      this.customer = new Customer();
    });
  }

  private findIndexById(idCliente: number): number {
    let index = -1;
    for (let i = 0; i < this.customers.length; i++) {
      if (this.customers[i].idCliente === idCliente) {
        index = i;
        break;
      }
    }
    return index;
  }

}
