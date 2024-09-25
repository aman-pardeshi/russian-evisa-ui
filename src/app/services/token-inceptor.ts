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
    const userToken =
      'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MjkxNzc1MTksInVzZXJfaWQiOjF9.PzvES-JElut9TvcmIcf6-_PqHb63J0oJcQSnjyfDybk';
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `${userToken}`),
    });
    return next.handle(modifiedReq);
  }
}
