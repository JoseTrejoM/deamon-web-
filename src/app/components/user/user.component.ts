import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class UserComponent implements OnInit {

  users: User[] = [];
  userNew: User = new User();
  submitted: boolean = false;
  showDialog: boolean = false;

  constructor(private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.userService.getCustomersAll().then((data:User[])=>{
      this.users = data;
    });
  }

  openNew(form: NgForm) {
    form.resetForm();
    this.userNew = new User();
    this.showDialog = true;
  }

  hideDialog() {
    this.showDialog = false;
    this.submitted = false;
  }

  editUser(user: User) {
    this.userNew = { ...user };
    this.showDialog = true;
  }

  deleteUser(user: User) {
    //console.log(customer);
    this.confirmationService.confirm({
      message: '¿Esta seguro de eliminar a ' + user.correo + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      acceptButtonStyleClass: 'p-button-primary',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-danger',
      accept: async () => {
        //this.showLoading = true;
        this.showLoading();
        await this.userService.deleteUsers(user.idUsuario).then((data: User) => {
          //this.showLoading = false;
          this.users = this.users.filter((val: User) => val.idUsuario !== user.idUsuario);
          //this.customer = new Customer();
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: data.correo + ' usuario eliminado ', life: 3000 });
          Swal.close();
        }).catch(err => {
          Swal.close();
          //this.showLoading = false;
        });
      }
    });
  }

  saveOrUpdateUser() {
    if(!this.userNew.correo || !this.userNew.contrasenia || !this.userNew.tipo){
      return;
    }

    this.submitted = true;
    if (this.userNew.correo.trim()) {
      if (this.userNew.idUsuario && this.userNew.idUsuario > 0) {
        this.updateUser(this.userNew);
      } else {
        this.createUser(this.userNew);
      }
    }
  }

  private async createUser(user: User) {
    this.showLoading();
    await this.userService.createUsers(user).then((data: User) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario creado', life: 3000 });

      this.users.push(data);
      this.showDialog = false;
      this.userNew = new User();
      Swal.close();
    });
  }

  private async updateUser(user: User) {
    this.showLoading();
    await this.userService.updateUsers(user).then((data: User) => {
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario actualizado', life: 3000 });

      this.users[this.findIndexById(data.idUsuario)] = data;
      this.showDialog = false;
      this.userNew = new User();
      Swal.close();
    });
  }

  private findIndexById(idUsuario: number): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].idUsuario === idUsuario) {
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
