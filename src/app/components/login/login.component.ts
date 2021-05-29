import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from 'src/app/models/user.model';
import { LoginService } from 'src/app/services/login.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  user!: User;

  constructor(private router: Router, private loginService: LoginService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.user = { idUsuario: 0, correo: '', contrasenia: '', tipo: '' };
  }

  loginIn(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.showLoading();
    this.loginService.getValidateLogin(this.user).subscribe(
      (data) => {
        Swal.close();
        this.router.navigateByUrl('/main');
      }, (err) => {
        console.log(err);
        //setTimeout(()=>{
        this.withError(err, 'Usuario o contraseña no validos');
        //}, 3000);
      });
  }

  private withError(err: any, msgError: string) {
    Swal.close();
    let messageError = '';
    if (err.status && err.status == 400) {
      messageError = msgError;
    } else {
      messageError = 'Error inesperado intente mas tarde';
    }
    this.showMessage('error', 'Error', messageError);
  }

  private showLoading() {
    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();
  }

  private showMessage(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, life: 3000 });
  }

}
