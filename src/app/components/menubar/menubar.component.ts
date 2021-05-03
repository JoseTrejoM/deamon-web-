import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

  items: MenuItem[] = [];
  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: "/home"
      },
      {
        label: 'Clientes',
        routerLink: "customer"
      },
      {
        label: 'Autorizacion',
        icon: 'pi pi-fw pi-check'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-users'
      }
    ];
  }

  logOff(){
    this.loginService.clearLoginData();
    this.router.navigate(['login']);
  }

}
