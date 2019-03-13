import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {User} from '../../../shared/models/user';

@Injectable({providedIn: 'root'})
export class ChatService {

  private userSubject = new Subject<User>();
  private channelSubject = new Subject<User>();

  currentUser$ = this.userSubject.asObservable();
  channel$ = this.channelSubject.asObservable();

  set user(user: User) {
    this.userSubject.next(user);
  }

  set channel(channel: User) {
    this.channelSubject.next(channel);
  }
}
