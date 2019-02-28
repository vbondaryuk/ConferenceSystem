import {Component, OnInit} from '@angular/core';
import {UserCredential} from '../../models/user.credential';
import {AuthenticationService} from '../../services/authentication.service';
import {NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  private useCredential: UserCredential = {email: '', password: ''};
  private submitted = false;
  private loading = false;
  private returnUrl: string;
  private error: string;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  onSubmit(f: NgForm) {
    this.submitted = true;

    if (f.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.useCredential)
      .subscribe(() => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
