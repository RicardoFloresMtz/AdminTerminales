import { ReactiveFormsModule } from '@angular/forms';
import { Constants } from './usr-seguridad/test.constants';
import { FileUtil } from './usr-seguridad/file.util';
import { HeaderComponent } from './../login/header/header.component';
import { PagesComponent } from './pages.component';
import { PAGES_ROUTES } from './pages.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { UsrSeguridadComponent } from './usr-seguridad/usr-seguridad.component';
import { UsrEjecutivoComponent } from './usr-ejecutivo/usr-ejecutivo.component';
import { NavbarUsrInfoComponent } from './navbar-usr-info/navbar-usr-info.component';




@NgModule({
  declarations: [
  PagesComponent,
  UsrSeguridadComponent,
  UsrEjecutivoComponent,
  NavbarUsrInfoComponent
],
  imports: [
      PAGES_ROUTES,
      ReactiveFormsModule,
      BrowserModule
  ],
  providers: [FileUtil, Constants],
  bootstrap: []
})
export class PagesModule {  }
