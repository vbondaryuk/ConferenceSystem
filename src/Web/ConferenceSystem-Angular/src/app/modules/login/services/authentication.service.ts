import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '../../../../environments/environment';
import {UserRegistration} from '../models/user.registration';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private tokenSubject: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject<string>(localStorage.getItem('jwt_token'));
  }

  public login(userName: string, password: string) {
    return this.http.post<any>(`${environment.apiUri}/auth/authenticate`, {userName, password})
      .pipe(map(this.authResponseMap));
  }

  public register(userRegistration: UserRegistration): Observable<UserRegistration> {
    return this.http.post<any>(`${environment.apiUri}/auth/register`, userRegistration)
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
      localStorage.setItem('jwt_token', token);
      this.tokenSubject.next(token);
    }

    return token;
  }
}
