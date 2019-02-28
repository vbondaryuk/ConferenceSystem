import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthenticationService} from '../modules/login/services/authentication.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.authenticationService.logout();
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      }));
  }
}
