import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { environment } from '../../../environments/environment';

@Injectable()
export class SearchApiService {

  constructor(private http: HttpClient) { }

  getUsers(term: string): Observable<any> {
    const options = { params: new HttpParams().set('term', term) };
    return this.http.get(`${environment.apiEndpoint}/users/search`, options).pipe(
      catchError(this.handleError<any>(`get users/search/${term}`, []))
    );
  }

  handleError<T>(operation = 'operation', result?: any) {
    return (err: any): Observable<T> => {
      console.log(`${operation} failed: ${err}`);
      return of(result as T);
    };
  }
}
