import { DataBD_Operaciones } from './../../databd-operaciones';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-usr-ejecutivo',
  templateUrl: './usr-ejecutivo.component.html'
})
export class UsrEjecutivoComponent implements OnInit {

  myForm: FormGroup;
  arrayRegistros: Array<any> = [];
  IdTerminalSelect: string;
  EdoTerminalModal: string;
  CrModal: string;


  @ViewChild('rCR')  rCR: any;
  @ViewChild('rEstatus')  rEstatus: any;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      fcrCR: ['', [Validators.required,  Validators.pattern( /^([0-9]{4})$/)]],
    });
   }

  ngOnInit() {
    const this_aux = this;
    if (localStorage.getItem('sesion') === 'activa') {
      setTimeout(function() {
        this_aux.getRegistros();
      }, 3000);
    } else {
      $('#errorModal').modal('show');
      document.getElementById('mnsError').innerHTML = 'Tu sesión ha expirado';
    }
  }

  getRegistros() {

    const this_aux = this;
    const operaciones = new DataBD_Operaciones();

    operaciones.getRegistros().then(
      function (res) {
        console.log('Regreso respuesta');
        // console.log(res);
        const res_json = res.responseJSON;
        if (res_json.Id === '1') {
          setTimeout(function() {
                $('#modal_please_wait').modal('hide');
               this_aux.arrayRegistros = res_json.ArrayRegistros;
          }, 500);
        } else {
          setTimeout(function() {
            $('#modal_please_wait').modal('hide');
            $('#errorModal').modal('show');
            document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde.';
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
      });
  }

  getValuesTr(elementHTML) {
    const this_aux = this;
    // console.log(elementHTML.cells );
    const tds = elementHTML.cells;
    this_aux.IdTerminalSelect  = tds[3].innerText;
    this_aux.rCR.nativeElement.value = tds[4].innerText;
    const edo = tds[5].innerText;
    const edo_aux = edo.toString().trim();
    if (edo_aux === 'NA') {
      this_aux.rEstatus.nativeElement.value = '2';
    }
    if (edo_aux === 'ACTIVA') {
      this_aux.rEstatus.nativeElement.value = '1';
    }
    if (edo_aux === 'INACTIVA') {
      this_aux.rEstatus.nativeElement.value = '0';
    }

    $('#modalModificaEstatus').modal('show');
  }

  showConfirmaStatus(rCRvalue, rEstatusvalue, idTerminalvalue) {
    const this_aux = this;
    this_aux.CrModal = rCRvalue;
    if (rEstatusvalue === '2') {
      this_aux.EdoTerminalModal = 'NA';
    }
    if (rEstatusvalue === '1') {
      this_aux.EdoTerminalModal = 'ACTIVA';
    }
    if (rEstatusvalue === '0') {
      this_aux.EdoTerminalModal = 'INACTIVA';
    }
    this_aux.setUpdateCrStatus(idTerminalvalue, rCRvalue, rEstatusvalue, );
  }

  setUpdateCrStatus( idTerminalvalue, sucursal_id, activo) {
    $('#modal_please_wait').modal('show');
    const this_aux = this;
    const operaciones = new DataBD_Operaciones();
    operaciones.setUpdateCrStatus(idTerminalvalue, sucursal_id, activo).then(
      function(response) {
        // console.log(response);
        const jsonResp = response.responseJSON;
        if (jsonResp.Id === '1') {
          setTimeout(function() {
                  $('#modal_please_wait').modal('hide');
                  this_aux.getRegistros();
                  $('#modalConfirma').modal('show');
          }, 500);
        } else {
          setTimeout(function() {
               $('#modal_please_wait').modal('hide');
               $('#errorModal').modal('show');
               document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde.';
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
      });
  }

}
