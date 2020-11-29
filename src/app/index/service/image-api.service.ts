import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError, switchMap } from 'rxjs/operators';

import { Image } from '../dashboard/gallery/image.model';
import { AuthService } from '../../auth/auth.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class ImageApiService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getImages(id: string | null): Observable<Image[]> {
    return this.authService.getIdTokenPayload$().pipe(
      map(payload => `${environment.apiEndpoint}/users/${id ? id : payload.sub}/images`),
      switchMap(url => this.http.get<Image[]>(url)),
      catchError(this.handleError<Image[]>('get users/:id/images', []))
    );
  }

  postImage(saveDetails: any): Observable<{ url: string }> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.authService.getIdTokenPayload$().pipe(
      map(payload => `${environment.apiEndpoint}/users/${payload.sub}/images`),
      switchMap(url => this.http.post<{ url: string }>(url, saveDetails, options)),
      catchError(this.handleError<any>('post users/:id/images', {}))
    );
  }

  s3Upload(url: string, params: any, file: any): Observable<any> {
    const options = {
      headers: new HttpHeaders(params)
    };
    return this.http.put(url, file, options);
  }

  getSignedUrl(fileName: string, fileType: string): Observable<any> {
    const options = {
      params: new HttpParams()
        .set('fileName', fileName)
        .set('fileType', fileType)
    };
    return this.http.get(`${environment.apiEndpoint}/users/0/images/s3-signature`, options)
      .pipe(catchError(this.handleError<any>('get users/0/images/s3-signature', {})));
  }

  handleError<T>(operation = 'operation', result?: any) {
    return (err: any): Observable<T> => {
      console.log(`${operation} failed: ${err}`);
      return of(result as T);
    };
  }

  getSelfId(): Observable<string> {
    return this.authService.getIdTokenPayload$().pipe(
      map(payload => payload.sub)
    );
  }
}
