import {Component, Input, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {User} from '../../../../shared/models/user';
import {Message} from '../../models/message';
import {NgForm} from '@angular/forms';
import {Channel} from '../../models/channel';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  private messages: Message[] = [];
  private channel: Channel;
  private exception: string;

  @Input()
  user: User;


  constructor(
    private chatService: ChatService) {
    chatService.channel$.subscribe(channel => {
      this.messages = [];
      this.channel = channel;
    });
    chatService.message$.subscribe(message => {
      if (message.sender === this.channel.id) {
        this.messages.push(message);
      }
    });
  }

  ngOnInit() {
  }

  public sendMessage(messageForm: NgForm): void {
    const messageText = messageForm.value.message;
    messageForm.resetForm();
    if (!messageText || messageText.trim().length === 0) {
      return;
    }
    const message: Message = {
      message: messageText,
      recipient: this.channel.id,
      sendDate: new Date(),
      sender: this.user.email
    };

    this.chatService.sendMessage(message);
    this.messages.push(message);
  }
}
