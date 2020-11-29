import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable()
export class AnonymousGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    return this.isAnonymous$();
  }

  isAnonymous$(): Observable<boolean> {
    return this.authService.isAuthenticated$().pipe(
      catchError(err => of(false)),
      map(authenticated => !authenticated),
      tap(anonymous => {
        if (!anonymous) { this.router.navigateByUrl(''); }
      })
    );
  }
}
