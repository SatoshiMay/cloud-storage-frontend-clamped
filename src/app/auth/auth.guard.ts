import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    return this.isLoggedIn$();
  }

  isLoggedIn$(): Observable<boolean> {
    return this.authService.isAuthenticated$().pipe(
      catchError(err => of(false)),
      tap(authenticated => { if (!authenticated) { this.router.navigateByUrl('/welcome'); } })
    );
  }
}
