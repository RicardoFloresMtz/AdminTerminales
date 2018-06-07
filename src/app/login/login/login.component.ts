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
  isSeguridad = false;
  isNegocio = false;

  constructor(private service: SessionAppService, private fb: FormBuilder, private router: Router ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      // tslint:disable-next-line:max-line-length
      fcNombreUsuario: ['', [Validators.required, Validators.pattern(/^[a0-zA9-Z]+(\s*[a0-zA9-Z]*)*[a0-zA9-Z-\s]+$/)]],
      // tslint:disable-next-line:max-line-length
      fcPass: ['', [Validators.required,  Validators.pattern(/^[a0-zA9-Z]+(\s*[a0-zA9-Z-/\.\-\_\@\$]*)*[a0-zA9-Z-\s]+$/)]]
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
    const idEmpleado = usr;
    const respuestaUsuario = key;
    const operaciones = new DataBD_Operaciones();

    operaciones.identificaEmpleado( idEmpleado).then(
      function(resp) {
        console.log(resp);
         const resp_json = resp.responseJSON;
         if (resp_json.Id === 'SEG0001') {
            this_aux.consultaEmpleado(idEmpleado, respuestaUsuario);
         } else {
              setTimeout(function() {
                $('#modal_please_wait').modal('hide');
                $('#errorModal').modal('show');
                document.getElementById('mnsError').innerHTML = resp_json.MensajeAUsuario;
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


  consultaEmpleado(idEmpleado, respuestaUsuario) {
    const this_aux = this;
    const operaciones = new DataBD_Operaciones();
    operaciones.consultaDatosEmpleado(idEmpleado).then(
      function(resp1) {
        console.log(resp1);
          const resp1_json = resp1.responseJSON;
          if (resp1_json.Id === 'SEG0001') {
              if (resp1_json.ArrayGrupos === 'No pertenece a ningun grupo') {
                  setTimeout(function() {
                    $('#modal_please_wait').modal('hide');
                    $('#errorModal').modal('show');
                    document.getElementById('mnsError').innerHTML = 'El usuario no pertenece a grupo válido, favor de verificar.';

                  }, 500);
              } else {

                if ( this_aux.validaGrupoEmpleado(resp1_json)) {
                        this_aux.autenticaUsuario(respuestaUsuario);
                  } else {
                        setTimeout(function() {
                          $('#modal_please_wait').modal('hide');
                          $('#errorModal').modal('show');
                          document.getElementById('mnsError').innerHTML = 'El usuario no pertenece a grupo válido, favor de verificar.';

                        }, 500);
                    }
              }
           } else {
              setTimeout(function() {
                $('#modal_please_wait').modal('hide');
                $('#errorModal').modal('show');
                document.getElementById('mnsError').innerHTML = resp1_json.MensajeAUsuario;
            }, 500);
          }
      }, function(error1) {
        setTimeout(function() {
          $('#modal_please_wait').modal('hide');
          $('#errorModal').modal('show');
          if (error1.errorCode === 'API_INVOCATION_FAILURE') {
              document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
          } else {
            document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
          }
      }, 500);
    });
  }

  validaGrupoEmpleado(resp1_json) {
    const this_aux = this;
    const arrayGrupos = resp1_json.ArrayGrupos;
              arrayGrupos.forEach(element => {
                  if (element.Grupo === 'SUCAPPS2_NEGOCIO') {
                    this_aux.isNegocio = true;
                  }
                  if (element.Grupo === 'SUCAPPS2_SEGURIDAD') {
                    this_aux. isSeguridad = true;
                  }
               });

               if ( (this_aux.isNegocio && (this_aux.Perfil === '2')) || (this_aux.isSeguridad && (this_aux.Perfil === '1'))) {
                  return true;
               } else {
                  return false;
            }
  }


  autenticaUsuario(respuestaUsuario) {
    const this_aux = this;
    const operaciones = new DataBD_Operaciones();
    operaciones.autenticEmpleado(respuestaUsuario).then(
      function(resp2) {
          const resp2_json = resp2.responseJSON;
          console.log(resp2);
          if (resp2_json.Id === 'SEG0001') {
            sessionStorage.setItem('sesion', 'activa');
            this_aux.service.usuarioLogin = resp2_json.NombreUsuario;
          if (this_aux.isNegocio) {
            this_aux.router.navigate(['/usr_ejecutivo']);
          }
          if (this_aux.isSeguridad) {
            this_aux.router.navigate(['/usr_seguridad']);
          }
        } else {
            setTimeout(function() {
              $('#modal_please_wait').modal('hide');
              $('#errorModal').modal('show');
              document.getElementById('mnsError').innerHTML = resp2_json.MensajeAUsuario;
            }, 500);
          }
      }, function(error2) {
        setTimeout(function() {
            $('#modal_please_wait').modal('hide');
            $('#errorModal').modal('show');
            if (error2.errorCode === 'API_INVOCATION_FAILURE') {
              document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
            } else {
              // tslint:disable-next-line:max-line-length
              document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde';
            }
        }, 500);
      }
  );
  }
}
