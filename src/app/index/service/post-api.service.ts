import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { AuthService } from '../../auth/auth.service';

import { Post } from '../dashboard/posts/post.model';

import { environment } from '../../../environments/environment';

@Injectable()
export class PostApiService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getPosts(id: string | null, page: number, limit: number): Observable<Post[]> {
    const options = {
      params: new HttpParams().set('page', '' + page).set('limit', '' + limit)
    };
    return this.authService.getIdTokenPayload$().pipe(
      map(payload => `${environment.apiEndpoint}/users/${id ? id : payload.sub}/posts`),
      switchMap(url => this.http.get<Post[]>(url, options)),
      catchError(this.handleError<Post[]>('get users/:id/posts', null))
    );
  }

  postReply(id: string, reply: string): Observable<Post> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.authService.getIdTokenPayload$().pipe(
      map(payload => `${environment.apiEndpoint}/users/${payload.sub}/posts/${id}`),
      switchMap(url => this.http.post<Post>(url, { reply }, options)),
      catchError(this.handleError<Post>('post users/:id/posts/:id', null))
    );
  }

  handleError<T>(operation = 'operation', result?: any) {
    return (err: any): Observable<T> => {
      console.log(`${operation} failed:`, err);
      return of(result as T);
    };
  }
}
