
import { SessionAppService } from './../../session-app.service';
import { Constants } from './test.constants';
import { FileUtil } from './file.util';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DataBD_Operaciones } from './../../databd-operaciones';


declare var $: any;

@Component({
  selector: 'app-usr-seguridad',
  templateUrl: './usr-seguridad.component.html',
  styleUrls: ['./usr-seguridad.component.css']
})
export class UsrSeguridadComponent implements OnInit {

  @ViewChild('fileImportInput')
  fileImportInput: any;
  csvRecords = [];
  routeFile: string;
  usrLegacy: string ;
  passLegacy: string ;
  myForm: FormGroup;
  arrayRegistros: Array<any> = [];
  NumRegistros: any;
  NameArchivo = '1';
  IDDataBase = '1';
  Terminal_Id  = '1';

  constructor(private service: SessionAppService, private fb: FormBuilder, private router: Router,
    private _fileUtil: FileUtil) {
      this.myForm = this.fb.group({
        fcUsrLegacy: ['', [Validators.required,  Validators.minLength(32) ]],
        fcPassLegacy: ['', [Validators.required, Validators.minLength(16)]],
        fcPassLegacyConfirm: ['', [Validators.required, Validators.minLength(16)]],
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

  cagaParticular() {
    document.getElementById('divParticular').style.backgroundColor = '#e2062d';
    document.getElementById('divMasiva').style.backgroundColor = '#4f525d';
    $('#modalCargaParticular').modal('show');
  }

  cagaMasiva() {
    document.getElementById('divMasiva').style.backgroundColor = '#e2062d';
    document.getElementById('divParticular').style.backgroundColor = '#4f525d';
    $('#modalCargaMasiva').modal('show');
  }

  fileChangeListener(event, value): void {
    const text = [];
    const this_aux = this;
    const files = event.currentTarget.files;
    this_aux.routeFile = value;
    $('#inputval').text( value);
    if (Constants.validateHeaderAndRecordLengthFlag) {
      if (!this_aux._fileUtil.isCSVFile(files[0])) {
        this_aux.fileReset();
      }
    }

    const input = event.target;
    const reader = new FileReader();
    reader.readAsText(input.files[0]);

    reader.onload = (data) => {
      const csvData = reader.result;
      const csvRecordsArray = csvData.split(/\r\n|\n/);

      let headerLength = -1;
      if (Constants.isHeaderPresentFlag) {
        const headersRow = this_aux._fileUtil.getHeaderArray(csvRecordsArray, Constants.tokenDelimeter);
        headerLength = headersRow.length;
      }

      this_aux.csvRecords = this._fileUtil.getDataRecordsArrayFromCSVFile(csvRecordsArray,
          headerLength, Constants.validateHeaderAndRecordLengthFlag, Constants.tokenDelimeter);
        // console.log(this_aux.csvRecords);
      if (this_aux.csvRecords == null) {
        this_aux.fileReset();
      }

    };

    reader.onerror = function () {
      $('#errorModal').modal('show');
      document.getElementById('mnsError').innerHTML = 'Tipo de archivo incorrecto, el archivo debe ser .csv, favor de verificar.';
    };
  }

  fileReset() {
    $('#errorModal').modal('show');
    document.getElementById('mnsError').innerHTML = 'Tipo de archivo incorrecto, el archivo debe ser .csv, favor de verificar.';
    this.fileImportInput.nativeElement.value = '';
    this.csvRecords = [];
  }

  showConfirmacion() {
    $('#nameFile').text( this.routeFile);
    $('#modalConfirmaCMasiva').modal('show');
  }

  showConfirmacionCPart(usr, pass) {
    const this_aux = this;
    this_aux.usrLegacy = usr;
    this_aux.passLegacy = pass;
    // Calcular la terminal
    const tam_ArrayReg = this_aux.arrayRegistros.length;
    const columna = this_aux.arrayRegistros[tam_ArrayReg - 1];
    const idTerminal = columna.TERMINAL_ID;
    this_aux.insertUsrPassLegacy(usr, pass, idTerminal);
  }

  insertUsrPassLegacy(usr, pass, idTerminal) {
    $('#modal_please_wait').modal('show');
    const this_aux = this;
    const operaciones = new DataBD_Operaciones();

    operaciones.insertaUserPassLegacy(usr, pass, idTerminal).then(
      function (res) {
        console.log('Regreso respuesta');
        // console.log(res);
        const res_json = res.responseJSON;
            if (res_json.Id === '1') {
                setTimeout(function() {
                      $('#modal_please_wait').modal('hide');
                      this_aux.IDDataBase = res_json.ID;
                      this_aux.Terminal_Id = res_json.TERMINAL_ID;
                      this_aux.getRegistros();
                      $('#modalConfirmaCParticular').modal('show');
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

  doCargaMasiva() {
    const this_aux = this;
    if (this_aux.csvRecords == null) {
      // error no hay registros a cargar
    } else {
              // trego el ultimo el elemnto para sacar el Terminal ID con el que iniciara la insercion
              const tam_ArrayReg = this_aux.arrayRegistros.length;
              const tam_csvRecords = this_aux.csvRecords.length;
              this_aux.NumRegistros = tam_csvRecords;
              const columna = this_aux.arrayRegistros[tam_ArrayReg - 1];
              const idTerminal = columna.TERMINAL_ID;
              const firstColum = this_aux.csvRecords[0];
              const lastColum = this_aux.csvRecords[tam_csvRecords - 1];
              if ( firstColum[0] === 'Usuario' || firstColum[1] === 'Usuario Base 64'  || firstColum[1] === 'Contraseña Base 64' ) {
                this_aux.csvRecords.shift();
                this_aux.NumRegistros = this_aux.NumRegistros - 1;
              }
              if (lastColum[0] === '') {
                this_aux.csvRecords.pop();
                this_aux.NumRegistros = this_aux.NumRegistros - 1;
              }

              // console.log(this_aux.csvRecords);
            if ( this_aux.NumRegistros <= 200 ) {
              this_aux.iniCargaMasivaMasiva(idTerminal, this_aux.csvRecords);
            } else {
              $('#errorModal').modal('show');
              // tslint:disable-next-line:max-line-length
              document.getElementById('mnsError').innerHTML = 'El archivo de carga no debe contener más de 200 registros, favor de verificar.';
            }
    }
  }


  iniCargaMasivaMasiva( idTerminal, csvRecords) {
    $('#modal_please_wait').modal('show');
    const arraycsvRecords: Array <any> = [];
    const this_aux = this;
    const operaciones = new DataBD_Operaciones();
    csvRecords.forEach(element1 => {
        if ( element1[1].length === 32 && element1[2].length === 16) {
          const json = '{ "Identificador":"' + element1[0] + '", "User":"' + element1[1] + '", "Pass":"' + element1[2] + '" }';
          arraycsvRecords.push(json);
        }
      });
     this_aux.NumRegistros = arraycsvRecords.length;
     // console.log(this_aux.NumRegistros);
     const arraycsvRecordS = '{"Array":[' + arraycsvRecords + ']}';
     // console.log(arraycsvRecordS);
     const jsonArray = JSON.parse(arraycsvRecordS);
     const stringArray = JSON.stringify(jsonArray);
     operaciones.insertaUserPassLegacyMasiva(idTerminal, stringArray).then(
     function (res) {
        console.log('Regreso respuesta');
        // console.log(res);
        const res_json = res.responseJSON;
        if (res_json.Id === '1') {
            setTimeout(function() {
              $('#modal_please_wait').modal('hide');
              const arrayNameArchivo = this_aux.routeFile.split('\\');
              const tam_arrayNameArchivo = arrayNameArchivo.length;
               this_aux.NameArchivo = arrayNameArchivo[tam_arrayNameArchivo - 1];
              $('#modalFinCMasiva').modal('show');
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

  validaCarga() {
    $('#modal_please_wait').modal('show');
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
          }, 1000);
        } else {
          setTimeout(function() {
            $('#modal_please_wait').modal('hide');
            $('#errorModal').modal('show');
            document.getElementById('mnsError').innerHTML = 'El servicio no esta disponible, favor de intentar mas tarde.';
          }, 1000);
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
