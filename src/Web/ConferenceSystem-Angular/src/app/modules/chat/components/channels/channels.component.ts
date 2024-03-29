import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {User} from '../../../../shared/models/user';
import {ChatService} from '../../services/chat.service';
import {Channel} from '../../models/channel';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  private channels: Array<Channel>;
  private selectedChannel: Channel;

  @Input()
  user: User;

  constructor(
    private chatService: ChatService,
    private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.channels = users.filter(user => user.email !== this.user.email).map(this.map);
    });

    this.chatService.connectedUser$.subscribe(user => {
      const connectedChannel = this.channels.find(channel => channel.id === user.email);

      if (connectedChannel) {
        connectedChannel.online = true;
      } else if (this.user.email !== user.email) {
        const newChannel = this.map(user)
        newChannel.online = true;
        this.channels.push(newChannel);
      }
    });
    this.chatService.disconnectedUser$.subscribe(user => {
      const connectedChannel = this.channels.find(channel => channel.id === user.email);
      if (connectedChannel) {
        connectedChannel.online = false;
      }
    });
  }

  onSelectChannel(channel: Channel) {
    this.chatService.channel = channel;
    this.selectedChannel = channel;
  }

  private map(user: User): Channel {
    return {
      id: user.email,
      name: `${user.firstName} ${user.lastName}`,
      description: '',
      online: false
    };
  }
}
