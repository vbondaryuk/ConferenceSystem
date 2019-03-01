import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';

import {UserRegistration} from '../models/user.registration';
import {environment} from '../../../../environments/environment';
import {UserCredential} from '../models/user.credential';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private tokenSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject<string>(localStorage.getItem('jwt_token'));
  }

  public login(userCredential: UserCredential) {
    return this.http.post<any>(`${environment.apiUri}/user/authenticate`, userCredential)
      .pipe(map(this.authResponseMap));
  }

  public register(userRegistration: UserRegistration) {
    return this.http.post<any>(`${environment.apiUri}/user/register`, userRegistration)
      .pipe(map(this.authResponseMap));
  }

  public refreshToken() {
    // todo add
  }

  public logout() {
    localStorage.removeItem('jwt_token');
    this.tokenSubject.next(null);
  }

  public get token() {
    return this.tokenSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  private authResponseMap = token => {
    if (token) {
      localStorage.setItem('jwt_token', token.token);
      localStorage.setItem('jwt_refreshToken', token.eefreshToken);
      this.tokenSubject.next(token);
    }

    return token;
  }
}
