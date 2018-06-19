import { DataBD_Operaciones } from './../../databd-operaciones';
import { SessionAppService } from './../../session-app.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-navbar-usr-info',
  templateUrl: './navbar-usr-info.component.html',
  styleUrls: ['./navbar-usr-info.component.css']
})
export class NavbarUsrInfoComponent implements OnInit {

  NombreUsuario: string;
  constructor(private router: Router, private service: SessionAppService) { }

  ngOnInit() {
    this.NombreUsuario = this.service.usuarioLogin;
  }

  cerrarSesion() {
    $('#modal_please_wait').modal('show');
  const this_aux = this;
  const operaciones = new DataBD_Operaciones();
  operaciones.cerrarSesion().then(
    function(response) {
      console.log(response);
      const responseJSON = response.responseJSON;
      if (responseJSON.Id === 'SEG0001') {
        // TimerSessionTermina
        const body = $('body');
        body.off('click');
        WLAuthorizationManager.logout('banorteSecurityCheckSa');
        localStorage.removeItem('TimeOutIni');
        localStorage.removeItem('TimeOut');
        sessionStorage.removeItem('sesionPadre');
        sessionStorage.removeItem('sesion');
        // TimerSessionTermina

          setTimeout(function() {
            $('#modal_please_wait').modal('hide');
            this_aux.router.navigate(['/login']);
            location.reload(true);
        }, 1000);
      } else {
        setTimeout(function() {
          $('#modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
          document.getElementById('mnsError').innerHTML = responseJSON.MensajeAUsuario;
      }, 500);
      }
    }, function(error) {
      console.log(error);
        setTimeout(function() {
          $('#modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
          if (error.errorCode === 'API_INVOCATION_FAILURE') {
              document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
          } else {
            document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
          }
      }, 500);
    });
  }
}
