import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer.model';
import { CustomerService } from 'src/app/services/customer.service';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import Swal from 'sweetalert2';

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
  showDialog: boolean = false;

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

  async getCustomersAll(){
    await this.customerService.getCustomersAll().then((data: Customer[]) => {
      data.forEach((customer: Customer) => {
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
    this.showDialog = true;
  }

  hideDialog() {
    this.showDialog = false;
    this.submitted = false;
  }

  editCustomer(customer: Customer) {
    this.customer = { ...customer };
    this.customer.fechaNac = new Date(customer.fechaNac);
    this.customer.fechanacimiento = this.customer.fechaNac.getDate() + '/' + (this.customer.fechaNac.getMonth() + 1) + '/' + this.customer.fechaNac.getFullYear(); 
    this.showDialog = true;
    console.log(customer);
    console.log(this.customer);
  }

  deleteCustomer(customer: Customer) {
    //console.log(customer);
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar a ' + customer.nombre + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-primary',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-danger',
      accept: async () => {
        this.showLoading();
        await this.customerService.deleteCustomers(customer.idCliente).then((data: Customer) => {
          this.customers = this.customers.filter((val: Customer) => val.idCliente !== customer.idCliente);
          this.customer = new Customer();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: data.nombre + ' cliente eliminado ', life: 3000 });
          Swal.close();
        }).catch(err => {
          Swal.close();
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
      if (this.customer.idCliente && this.customer.idCliente > 0) {
        this.updateCustomer(this.customer);
      } else {
        this.createCustomer(this.customer);
      }
    }
  }

  private async createCustomer(customer: Customer) {
    this.showLoading();
    await this.customerService.createCustomers(customer).then((data: Customer) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente creado', life: 3000 });

      this.customers.push(data);
      this.showDialog = false;
      this.customer = new Customer();
      Swal.close();
    });
  }

  private async updateCustomer(customer: Customer) {
    this.showLoading();
    await this.customerService.updateCustomers(customer).then((data: Customer) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Cliente actualizado', life: 3000 });

      this.customers[this.findIndexById(data.idCliente)] = data;
      this.showDialog = false;
      this.customer = new Customer();
      Swal.close();
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

  private showLoading(){
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
  }

}
