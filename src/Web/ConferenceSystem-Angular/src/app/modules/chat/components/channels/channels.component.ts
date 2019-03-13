import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {User} from '../../../../shared/models/user';
import {ChatService} from '../../services/chat.service';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  private users: User[];
  private selectedUser: User;

  constructor(
    private chatService: ChatService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => this.users = users);

  }

  onSelectUser(user: User) {
    this.chatService.channel = user;
    this.selectedUser = user;
  }
}
