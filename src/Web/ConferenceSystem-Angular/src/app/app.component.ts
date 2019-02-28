import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private hubConnection: HubConnection | undefined;
  userName = '';
  message = '';
  messages: string[] = [];

  constructor() {
  }

  ngOnInit() {
    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl('http://localhost:14390/conference')
    //   .configureLogging(signalR.LogLevel.Information)
    //   .build();
    //
    // this.hubConnection.start().catch(err => console.error(err.toString()));
    //
    // this.hubConnection.on('receiveMessage', (username: string, message: string) => {
    //   const received = `${username}:  ${message}`;
    //   this.messages.push(received);
    // });
  }

  public sendMessage(): void {
    const data = `Sent: ${this.message}`;

    if (this.hubConnection) {
      this.hubConnection.send('sendMessage', this.userName, this.message).then(() => this.message = '');
    }
    // this.messages.push(data);
  }
}
