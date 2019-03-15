import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {UserService} from '../../../../shared/services/user.service';
import {User} from '../../../../shared/models/user';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loggedIn: boolean;
  user$: Observable<User>;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.loggedIn = authenticationService.isLoggedIn;
  }

  ngOnInit(): void {
    this.user$ = this.userService.getUser();
  }

  public logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
