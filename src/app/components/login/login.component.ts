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
      this.isInvalid = true;
      if (err.status && err.status == 400) {
        this.messageInvalid = 'Usuario o contraseña no validos';
      } else {
        this.messageInvalid = 'Error inesperado';
      }
      Swal.close();
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

    this.showLoading();
    this.loginService.createUser(this.userNew).then((data:User)=>{
      this.showDialog = false;
      Swal.close();
    }).catch(err => {
      console.log(err);
      this.isNewUserInvalid = true;
      if (err.status && err.status == 400) {
        this.messageInvalid = 'El usuario ya existe';
      } else {
        this.messageInvalid = 'Error inesperado';
      }
      Swal.close();
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

}
