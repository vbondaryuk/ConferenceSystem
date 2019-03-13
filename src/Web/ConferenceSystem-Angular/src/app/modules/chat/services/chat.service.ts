import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {User} from '../../../shared/models/user';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import * as signalR from '@aspnet/signalr';
import {HubConnection} from '@aspnet/signalr';
import {Message} from '../models/message';
import {Channel} from '../models/channel';

@Injectable({providedIn: 'root'})
export class ChatService {

  private hubConnection: HubConnection | undefined;

  private userSubject = new BehaviorSubject<User>(null);
  private channelSubject = new Subject<Channel>();
  private messageSubject = new Subject<Message>();
  private connectedUserIdSubject = new Subject<string>();
  private disconnectedUserIdSubject = new Subject<string>();

  currentUser$ = this.userSubject.asObservable();
  channel$ = this.channelSubject.asObservable();
  message$ = this.messageSubject.asObservable();
  connectedUser$ = this.connectedUserIdSubject.asObservable();
  disconnectedUser$ = this.disconnectedUserIdSubject.asObservable();

  constructor(
    private authenticationService: AuthenticationService) {
    this.startSignalR();
  }

  public set user(user: User) {
    this.userSubject.next(user);
  }

  public set channel(channel: Channel) {
    this.channelSubject.next(channel);
  }

  public sendMessage(message: Message) {
    this.hubConnection.send('sendMessage', message);
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

    this.hubConnection.start()
      .then(() => this.hubConnection.send('requestConnectedClients'))
      .catch(err => console.error(err.toString()));
    this.hubConnection.onclose(() => {
      setTimeout(() => {
        this.hubConnection.start().catch(err => console.error(err.toString()));
      }, 3000);
    });

    // this.hubConnection.send('requestConnectedClients');

    this.hubConnection.on('connectedUsers', (userIds: Array<string>) => {
      userIds.forEach(userId => this.connectedUserIdSubject.next(userId));
    });

    this.hubConnection.on('onConnectedUser', (userId: string) => {
      this.connectedUserIdSubject.next(userId);
    });

    this.hubConnection.on('onDisconnectedUser', (userId: string) => {
      this.disconnectedUserIdSubject.next(userId);
    });

    this.hubConnection.on('receiveMessage', (message: Message) => {
      this.messageSubject.next(message);
    });

  }
}
