import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {HttpErrorInterceptor} from './interceptors/http-error.interceptor';
import {LoginModule} from './modules/login/login.module';
import {routing} from './app.routing';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    LoginModule,
    HttpClientModule,
    routing
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
