import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {User} from '../models/user';
import {environment} from '../../../../environments/environment';
import {UserRegistration} from '../models/user.registration';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public user: Observable<User>;
  private userSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  get User(): User {
    return this.userSubject.value;
  }

  login(userName: string, password: string) {
    return this.http.post<any>(`${environment.apiUri}/auth/authenticate`, {userName, password})
      .pipe(map(this.authResponseMap));
  }

  register(userRegistration: UserRegistration): Observable<UserRegistration> {
    return this.http.post<any>(`${environment.apiUri}/accounts`, userRegistration)
      .pipe(map(this.authResponseMap));
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('jwt_token');
    this.userSubject.next(null);
  }

  private authResponseMap = user => {
    if (user && user.token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('jwt_token', user.token);
      this.userSubject.next(user);
    }

    return user;
  }
}
