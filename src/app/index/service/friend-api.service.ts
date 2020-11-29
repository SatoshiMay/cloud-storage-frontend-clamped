import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { AuthService } from '../../auth/auth.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class FriendApiService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getFriends(id: string | null): Observable<any> {
    return this.authService.getIdTokenPayload$().pipe(
      map(payload => `${environment.apiEndpoint}/users/${id ? id : payload.sub}/friends`),
      switchMap(url => this.http.get<any>(url)),
      catchError(this.handleError<any>('get users/:id/friends', []))
    );
  }

  handleError<T>(operation = 'operation', result?: any) {
    return (err: any): Observable<T> => {
      console.log(`${operation} failed: ${err}`);
      return of(result as T);
    };
  }
}
