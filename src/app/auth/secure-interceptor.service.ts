import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable()
export class SecureInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if (!environment.production) {
    if (!environment.production || environment.production) { // TODO use https in production
      return next.handle(req);
    }
    const secureReq = req.clone({ url: req.url.replace('http://', 'https://') });
    return next.handle(secureReq);
  }
}
