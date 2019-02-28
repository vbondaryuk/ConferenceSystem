import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routing} from './login.routing';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    routing
  ],
})
export class LoginModule {
}
