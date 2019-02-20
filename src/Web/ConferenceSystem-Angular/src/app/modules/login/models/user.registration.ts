import {User} from './user';

export interface UserRegistration extends User {
  password: string;
}
