import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from './components/dialog/dialog.component';
import {ChannelsComponent} from './components/channels/channels.component';

@NgModule({
  declarations: [DialogComponent, ChannelsComponent],
  imports: [
    CommonModule
  ],
  exports: [DialogComponent, ChannelsComponent]

})
export class ChatModule {
}
