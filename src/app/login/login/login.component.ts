import { SessionAppService } from './../../session-app.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataBD_Operaciones } from './../../databd-operaciones';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @ViewChild('rPerfil', { read: ElementRef}) rPerfil: ElementRef ;
  myForm: FormGroup;
  Perfil = '0' ;

  constructor(private service: SessionAppService, private fb: FormBuilder, private router: Router ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      fcNombreUsuario: ['', [Validators.required]],
      fcPass: ['', [Validators.required]]
    });
  }

  setValuePerfil() {
    const this_aux = this;
    this_aux.Perfil = this_aux.rPerfil.nativeElement.value;
    console.log(this_aux.rPerfil.nativeElement.value);
  }

  LogIn(usr, key) {
    $('#modal_please_wait').modal('show');
    const this_aux = this;
    const operaciones = new DataBD_Operaciones();
    operaciones.getAcceso(this_aux.Perfil, usr, key).then(
      function(resp) {
        console.log(resp);
         const resp_json = resp.responseJSON;
         if (resp_json.Acceso === true) {
          sessionStorage.setItem('sesion', 'activa');
            if (this_aux.Perfil === '1') {
              this_aux.router.navigate(['/usr_seguridad']);
            } else if (this_aux.Perfil === '2') {
              this_aux.router.navigate(['/usr_ejecutivo']);
            }
         } else {
              setTimeout(function() {
                $('#modal_please_wait').modal('hide');
                $('#errorModal').modal('show');
                document.getElementById('mnsError').innerHTML = 'Los datos proporcionados son incorrectos, favor de verificar.';
            }, 500);
        }
      }, function(error) {

            setTimeout(function() {
                $('#modal_please_wait').modal('hide');
                $('#errorModal').modal('show');
                if (error.errorCode === 'API_INVOCATION_FAILURE') {
                    document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
                } else {
                  document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
                }
            }, 500);

          }
    );
  }
}
