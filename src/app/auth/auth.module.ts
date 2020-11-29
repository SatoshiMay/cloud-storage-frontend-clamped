import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './auth.service';
import { AuthInterceptor } from './auth-interceptor.service';
import { SecureInterceptor } from './secure-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard } from './auth.guard';
import { AnonymousGuard } from './anonymous.guard';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SecureInterceptor, multi: true },
    AuthService,
    AuthGuard,
    AnonymousGuard
  ]
})
export class AuthModule { }
