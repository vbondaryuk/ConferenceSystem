import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './modules/login/components/login/login.component';
import {AuthGuard} from './guards/app.gurd';
import {AppComponent} from './app.component';

const appRoutes: Routes = [
  {path: '', component: AppComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
