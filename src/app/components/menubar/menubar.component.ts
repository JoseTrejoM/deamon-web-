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
        command: ()=>{
          this.router.navigate([{ outlets: {mod: ['home'] } }]);
        }
      },
      {
        label: 'Clientes',
        command: ()=>{
          this.router.navigate([{ outlets: {mod: ['customer'] } }]);
        }
      },
      {
        label: 'Polizas',
        icon: 'pi pi-fw pi-check',
        command: ()=>{
          this.router.navigate([{ outlets: {mod: ['insurance'] } }]);
        }
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-users',
        command: ()=>{
          this.router.navigate([{ outlets: {mod: ['user'] } }]);
        }
      }
    ];

    this.router.navigate([{ outlets: {mod: ['home'] } }]);
  }

  logOff(){
    this.loginService.clearLoginData();
    this.router.navigateByUrl('/login');
  }

}
