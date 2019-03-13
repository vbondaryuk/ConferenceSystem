import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {UserService} from '../../../../shared/services/user.service';
import {User} from '../../../../shared/models/user';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loggedIn: boolean;
  user: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.loggedIn = authenticationService.isLoggedIn;
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(user => this.user = user);
  }

  public logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
