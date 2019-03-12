import {Component, OnInit} from '@angular/core';
import {UserRegistration} from '../../../../shared/models/user.registration';
import {NgForm} from '@angular/forms';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private userRegistration: UserRegistration = {email: '', password: '', firstName: '', lastName: ''};
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
    this.authenticationService.register(this.userRegistration)
      .subscribe(() => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }
}
