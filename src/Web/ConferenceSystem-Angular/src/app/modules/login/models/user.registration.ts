import {UserCredential} from './user.credential';

export interface UserRegistration extends UserCredential {
  firstName: string;
  lastName: string;
}
