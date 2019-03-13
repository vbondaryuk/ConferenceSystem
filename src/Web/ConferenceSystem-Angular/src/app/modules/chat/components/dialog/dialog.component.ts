import {Component, Input, OnInit} from '@angular/core';
import * as signalR from '@aspnet/signalr';
import {HubConnection} from '@aspnet/signalr';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {ChatService} from '../../services/chat.service';
import {User} from '../../../../shared/models/user';
import {Message} from '../../models/message';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  private hubConnection: HubConnection | undefined;
  private connected: boolean;
  private messages: Message[] = [];
  private channel: User;
  private exception: string;

  @Input()
  user: User;


  constructor(
    private chatService: ChatService,
    private authenticationService: AuthenticationService) {
    chatService.channel$.subscribe(channel => {
      this.messages = [];
      this.channel = channel;
      // this.messages.push({
      //   message: 'asfasfasfasf',
      //   recipient: this.channel.email,
      //   sendDate: new Date(),
      //   sender: this.user.email
      // });
      // this.messages.push({
      //   message: 'asfasfasfasf',
      //   recipient: this.channel.email,
      //   sendDate: new Date(),
      //   sender: this.user.email
      // });
      // this.messages.push({
      //   message: 'asfasfasfasf',
      //   recipient: this.user.email,
      //   sendDate: new Date(),
      //   sender: this.channel.email
      // });
      // this.messages.push({
      //   message: 'asfasfasfasf',
      //   recipient: this.channel.email,
      //   sendDate: new Date(),
      //   sender: this.user.email
      // });
    });
  }

  ngOnInit() {
    this.startSignalR();
  }

  public sendMessage(messageForm: NgForm): void {
    const messageText = messageForm.value.message;
    messageForm.resetForm();

    const message: Message = {
      message: messageText,
      recipient: this.channel.email,
      sendDate: new Date(),
      sender: this.user.email
    };

    if (this.hubConnection) {
      this.hubConnection.send('sendMessage', message);
    }
    this.messages.push(message);
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

    this.hubConnection.on('receiveException', (exception: string) => {
      this.exception = exception;
    });

    this.hubConnection.on('receiveMessage', (message: Message) => {
      this.messages.push(message);
    });

    this.connected = true;
  }
}
