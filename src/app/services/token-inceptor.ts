import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails')!)
      : null;

    const modifiedReq = userDetails?.authToken
      ? req.clone({
          headers: req.headers.set(
            'Authorization',
            `${userDetails.authToken}`
          ),
        })
      : req;
    return next.handle(modifiedReq);
  }
}
