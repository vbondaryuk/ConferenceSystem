import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/user';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private http: HttpClient) {
  }

  public getUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUri}/user`);
  }

  public getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUri}/user/items`);
  }
}
