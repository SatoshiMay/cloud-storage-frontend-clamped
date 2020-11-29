import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import * as parseDomain from 'parse-domain';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isSameOrigin(req.url, environment.apiEndpoint)) {// skip if req is not to apiEndpoint
      return next.handle(req);
    }

    return this.authService.getIdToken$().pipe(
      switchMap(token => {
        const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
        return next.handle(authReq);
      })
    );
  }

  isSameOrigin(url, origin) {
    // TODO: move to better implementation
    const parseOps = { customTlds: /localhost|\.local/ };
    return (JSON.stringify(parseDomain(url, parseOps)) ===
      JSON.stringify(parseDomain(origin, parseOps)));
  }
}
