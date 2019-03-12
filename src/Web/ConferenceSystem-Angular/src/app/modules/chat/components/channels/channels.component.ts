import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../../shared/services/user.service';
import {User} from '../../../../shared/models/user';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit {
  private users: User[];
  private selectedUser: User;
  public selectedUserSubject: BehaviorSubject<User> = new BehaviorSubject(null);

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => this.users = users);

  }

  onSelectUser(user: User) {
    this.selectedUser = user;
    this.selectedUserSubject.next(user);
  }
}
