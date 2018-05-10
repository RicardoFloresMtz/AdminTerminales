import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-usr-info',
  templateUrl: './navbar-usr-info.component.html',
  styleUrls: ['./navbar-usr-info.component.css']
})
export class NavbarUsrInfoComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  cerrarSesion() {
   sessionStorage.removeItem('sesion');
  this.router.navigate(['/login']);
  }
}
