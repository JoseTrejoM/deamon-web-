import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/models/loginresponse.model';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  isInvalid: boolean = false;
  messageInvalid: string = '';

  userNew: User = new User();
  showDialog: boolean = false;
  isNewUserInvalid: boolean = false;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
  }

  async loginIn(form: NgForm) {
    console.log(form);
    if (!this.user.correo || !this.user.contrasenia) {
      console.log(form.submitted);
      return;
    }

    this.showLoading();
    await this.loginService.getValidateLogin(this.user).then((data: LoginResponse) => {
      this.router.navigateByUrl('/main');
      Swal.close();
    }).catch(err => {
//setTimeout(()=>{
      //this.isInvalid = true;
      let messageError = '';
      if (err.status && err.status == 400) {
        messageError = 'Usuario o contraseña no validos';
      } else {
        messageError = 'Error inesperado intente mas tarde';
      }
      Swal.close();
      this.showError(messageError);
//}, 3000);
    });
  }

  openNew(form: NgForm) {
    form.resetForm();
    this.userNew = new User();
    this.showDialog = true;
  }

  saveUser() {
    if (!this.userNew.correo || !this.userNew.contrasenia) {
      return;
    }
    this.userNew.tipo = 'admin';

    this.showDialog = false;
    this.showLoading();
    this.loginService.createUser(this.userNew).then((data:User)=>{
      //this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'usuario creado', life: 3000 });
      this.showDialog = false;
      Swal.close();
      this.showSuccess('Usuario ' + data.correo + ' creado');
    }).catch(err => {
      console.log(err);
      //this.isNewUserInvalid = true;
      let messageError = '';
      if (err.status && err.status == 400) {
        messageError = 'El usuario ya existe';
      } else {
        messageError = 'Error inesperado intente mas tarde';
      }
      Swal.close();
      this.showError(messageError);
      //this.messageService.add({ severity: 'error', summary: 'Error', detail: messageError, life: 3000 });
    });
  }

  private showLoading(){
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
  }

  private showSuccess(message: string){
    Swal.fire({
      allowOutsideClick: false,
      icon: 'success',
      text: message
    });
  }

  private showError(message: string){
    Swal.fire({
      allowOutsideClick: false,
      icon: 'error',
      text: message
    });
  }

}
