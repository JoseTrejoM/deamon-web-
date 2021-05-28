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
  userNew!: User;
  showDialog: boolean = false;
  userEmpty: User = {idUsuario: 0, correo: '', contrasenia: '', tipo: 'admin'};

  constructor(private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.userService.getCustomersAll().subscribe((data:User[])=>{
      this.users = data;
    });
  }

  openNew(form: NgForm) {
    form.resetForm();
    this.userNew = {...this.userEmpty};
    this.showDialog = true;
  }

  hideDialog() {
    this.showDialog = false;
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
      accept: () => {
        this.showLoading();
        this.userService.deleteUsers(user.idUsuario).subscribe((data: User) => {
          this.users = this.users.filter((val: User) => val.idUsuario !== user.idUsuario);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: data.correo + ' usuario eliminado ', life: 3000 });
          Swal.close();
        }, (err) => {
          console.log(err);
          Swal.close();
        });
      }
    });
  }

  saveOrUpdateUser() {
    if(!this.userNew.correo || !this.userNew.contrasenia){
      return;
    }

    if (this.userNew.correo.trim()) {
      if (this.userNew.idUsuario && this.userNew.idUsuario > 0) {
        this.updateUser(this.userNew);
      } else {
        this.createUser(this.userNew);
      }
    }
  }

  private createUser(user: User) {
    this.showLoading();
    this.userService.createUsers(user).subscribe((data: User) => {
      //this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario creado', life: 3000 });

      this.users.push(data);
      this.withSuccess(data.correo + ' creado');
    },(err) => {
      this.withError(err, 'El usuario ya existe');
      console.log(err);
    });
  }

  private updateUser(user: User) {
    this.showLoading();
    this.userService.updateUsers(user).subscribe((data: User) => {
      //this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario actualizado', life: 3000 });

      this.users[this.findIndexById(data.idUsuario)] = data;
      this.withSuccess(data.correo + ' actualizado');
    },(err) => {
      this.withError(err, 'Error al actualizar');
      console.log(err);
    });
  }

  private withSuccess(message: string){
    this.showDialog = false;
    this.userNew = {...this.userEmpty};
    Swal.close();
    this.showSuccess(message);
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

  private withError(err: any, msgError: string) {
    this.showDialog = false;
    Swal.close();
    let messageError = '';
    if (err.status && err.status == 400) {
      messageError = msgError;
    } else {
      messageError = 'Error inesperado intente mas tarde';
    }
    this.showError(messageError);
  }

  private showLoading() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
  }

  private showSuccess(message: string) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      text: message
    });
  }

  private showError(message: string) {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'error',
      text: message
    });
  }

}
