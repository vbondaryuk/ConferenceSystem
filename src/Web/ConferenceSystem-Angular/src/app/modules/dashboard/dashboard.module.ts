import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {ChatModule} from '../chat/chat.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ChatModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {
}
