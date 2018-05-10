/// <reference path="../../node_modules/cordova-plugin-mfp/typings/worklight.d.ts" />
import { APP_ROUTES } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PagesModule } from './pages/pages.module';
import { SessionAppService } from './session-app.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login/login.component';
import { HeaderComponent } from './login/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    PagesModule,
    ReactiveFormsModule
  ],
  providers: [SessionAppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
