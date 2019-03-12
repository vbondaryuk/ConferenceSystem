import {Component, OnInit} from '@angular/core';
import {UserLogin} from '../../../../shared/models/user.login';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  private userLogin: UserLogin = {email: '', password: ''};
  private submitted = false;
  private loading = false;
  private returnUrl: string;
  private error: string;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {  }

  ngOnInit() {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['/']);
    }
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit(f: NgForm) {
    this.submitted = true;

    if (f.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.userLogin)
      .subscribe(() => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
