import {RegisterComponent} from './components/register/register.component';
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from './components/login/login.component';

const appRoutes: Routes = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent}
];

export const routing: ModuleWithProviders = RouterModule.forChild(appRoutes);
