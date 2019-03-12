import { Component, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {HubConnection} from '@aspnet/signalr';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  private hubConnection: HubConnection | undefined;
  private connected: boolean;
  userName = '';
  message = '';
  messages: string[] = [];

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  public sendMessage(): void {
    const data = `Sent: ${this.message}`;

    if (this.hubConnection) {
      this.hubConnection.send('sendMessage', this.userName, this.message).then(() => this.message = '');
    }
    this.messages.push(data);
  }

  private startSignalR() {
    const token = this.authenticationService.token;
    if (!token) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`http://localhost:4201/conference?token=${token}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.start().catch(err => console.error(err.toString()));

    this.hubConnection.on('receiveMessage', (username: string, message: string) => {
      const received = `${username}:  ${message}`;
      this.messages.push(received);
    })

    this.connected = true;
  }
}
