import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { of } from 'rxjs/observable/of';
import { switchMap, catchError } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { IAuthenticationDetailsData } from 'amazon-cognito-identity-js';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private http: HttpClient,
    private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.createForm();
    // this.login();
  }

  createForm() {
    this.loginForm = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.login(this.loginForm.value);
  }

  login(data: IAuthenticationDetailsData): void {
    this.authService.login$(data)
      //   .pipe(
      //   switchMap(_ => this.http.post(`${environment.apiEndpoint}/auth/idToken`, null)),
      //   // catchError(err => of(err))
      // )
      .subscribe(
      res => { console.log('Login Successful'); this.router.navigateByUrl(''); },
      err => { console.log('Login Unsuccessful'); }
      );
  }
}
