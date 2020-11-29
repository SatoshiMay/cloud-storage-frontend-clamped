import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import {
  CognitoUser, CognitoUserPool, ICognitoUserPoolData, CognitoUserSession,
  AuthenticationDetails, IAuthenticationDetailsData,
  ICognitoUserData, CognitoUserAttribute, ICognitoUserAttributeData, ISignUpResult
} from 'amazon-cognito-identity-js';
import { IdTokenPayload } from './id-token-payload.model';

import * as jwtDecode from 'jwt-decode';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private static _USER_POOL_ID = environment.AWS.Cognito.UserPoolId;
  private static _CLIENT_ID = environment.AWS.Cognito.ClientId;
  private static _POOL_DATA: ICognitoUserPoolData = {
    UserPoolId: AuthService._USER_POOL_ID,
    ClientId: AuthService._CLIENT_ID
  };
  private userPool: CognitoUserPool;
  // public userId$ = new ReplaySubject<String>(1); // replay the last value for late subscribers

  constructor() {
    this.userPool = new CognitoUserPool(AuthService._POOL_DATA);
    // this.getIdToken$().subscribe(id => this.userId$.next(id), () => {}); // check if there is already a valid token
  }

  // Authentication Confirmed User
  login$(authData: IAuthenticationDetailsData): Observable<CognitoUserSession> {
    return Observable.create(observer => {
      const authenticationData: IAuthenticationDetailsData = authData;
      const authenticationDetails = new AuthenticationDetails(authenticationData);

      const userData: ICognitoUserData = { Username: authData.Username, Pool: this.userPool };
      const cognitoUser = new CognitoUser(userData);
      const self = this;
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          // console.log(result);
          // self.userId$.next(result.getIdToken().getJwtToken());
          observer.next(result);
          observer.complete();
        },
        onFailure(err) {
          console.log(err);
          // self.userId$.next(null);
          observer.error(err);
        }
      });
    });
  }

  // Logout User
  logout() {
    if (this.userPool.getCurrentUser() !== null) {
      this.userPool.getCurrentUser().signOut();
      console.log('logout');
      // this.userId$.next(null);
    }
  }

  // Get Id Token
  getIdToken$(): Observable<string> {
    return Observable.create(observer => {
      const cognitoUser = this.userPool.getCurrentUser();
      const self = this;
      if (cognitoUser !== null) {
        this.userPool.getCurrentUser().getSession(function (err, session) {
          if (err) {
            console.log(err);
            // self.userId$.next(null);
            observer.error(err);
          } else if (session.isValid()) {
            observer.next(session.getIdToken().getJwtToken());
            // self.userId$.next(session.getIdToken().getJwtToken());
            observer.complete();
          } else {
            console.log('In AuthService.getIdToken(): Got Id token but session isn\'t valid');
            // self.userId$.next(null);
            observer.error(new Error('In AuthService.getIdToken(): Got Id token but session isn\'t valid'));
          }
        });
      } else {
        console.log('In AuthService.getIdToken(): cognitoUser is null');
        // self.userId$.next(null);
        observer.error(new Error('In AuthService.getIdToken(): cognitoUser is null'));
      }
    });
  }

  getIdTokenPayload$(): Observable<IdTokenPayload> {
    return Observable.create(observer => {
      const cognitoUser = this.userPool.getCurrentUser();
      const self = this;
      if (cognitoUser !== null) {
        this.userPool.getCurrentUser().getSession(function (err, session) {
          if (err) {
            console.log(err);
            // self.userId$.next(null);
            observer.error(err);
          } else if (session.isValid()) {
            observer.next(jwtDecode(session.getIdToken().getJwtToken()));
            // self.userId$.next(session.getIdToken().getJwtToken());
            observer.complete();
          } else {
            console.log('In AuthService.getIdToken(): Got Id token but session isn\'t valid');
            // self.userId$.next(null);
            observer.error(new Error('In AuthService.getIdToken(): Got Id token but session isn\'t valid'));
          }
        });
      } else {
        console.log('In AuthService.getIdToken(): cognitoUser is null');
        // self.userId$.next(null);
        observer.error(new Error('In AuthService.getIdToken(): cognitoUser is null'));
      }
    });
  }

  isAuthenticated$(): Observable<boolean> {
    return Observable.create(observer => {
      const cognitoUser = this.userPool.getCurrentUser();
      const self = this;
      if (cognitoUser !== null) {
        this.userPool.getCurrentUser().getSession(function (err, session) {
          if (err) {
            console.log(err);
            // self.userId$.next(null);
            observer.error(err);
          } else if (session.isValid()) {
            // self.userId$.next(session.getIdToken().getJwtToken());
            observer.next(true);
            observer.complete();
          } else {
            // self.userId$.next(null);
            observer.next(false);
            observer.complete();
          }
        });
      } else {
        console.log('In AuthSerive.isAuthenticated(): unable to retrieve current user');
        // self.userId$.next(null);
        observer.error(new Error('In AuthSerive.isAuthenticated(): unable to retrieve current user'));
      }
    });
  }

  // New User Registration
  register$(username: string, password: string, attributes?: ICognitoUserAttributeData[]):
    Observable<ISignUpResult> {
    return Observable.create(observer => {
      const attributeData = attributes.map(attr => new CognitoUserAttribute(attr));
      // if (email) {
      //   const dataEmail = {
      //     Name: 'email',
      //     Value: email
      //   };
      //   const attributeEmail = new CognitoUserAttribute(dataEmail);
      //   attributeData.push(attributeEmail);
      // }
      this.userPool.signUp(username, password, attributeData, null, (err, result) => {
        if (err) {
          console.log(err);
          observer.error(err);
          return;
        }
        observer.next(result);
        observer.complete();
      });

    });

  }
}
