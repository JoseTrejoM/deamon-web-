import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user!: User;
  userNew!: User;
  showDialog: boolean = false;

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.user = { idUsuario: 0, correo: '', contrasenia: '', tipo: '' };
    this.userNew = this.user;
  }

  loginIn(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.showLoading();
    this.loginService.getValidateLogin(this.user).subscribe(
      (data) => {
        console.log(data.user);
        this.router.navigateByUrl('/main');
        Swal.close();
      }, (err) => {
        //console.log(err);
        //setTimeout(()=>{
        Swal.close();
        this.withError(err, 'Usuario o contraseña no validos');
        //}, 3000);
      });
  }

  openNew(form: NgForm) {
    form.resetForm();
    this.userNew = { idUsuario: 0, correo: '', contrasenia: '', tipo: '' };
    this.showDialog = true;
  }

  saveUser() {
    if (!this.userNew.correo || !this.userNew.contrasenia) {
      return;
    }
    this.userNew.tipo = 'admin';

    this.showDialog = false;
    this.showLoading();
    this.loginService.createUser(this.userNew).subscribe((data: User) => {
      Swal.close();
      this.showSuccess('Usuario ' + data.correo + ' creado');
    }, (err) => {
      Swal.close();
      this.withError(err, 'El usuario ya existe');
    });
  }

  private withError(err: any, msgError: string) {
    console.log(err);
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
