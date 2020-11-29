import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ProfileApiService } from '../service/profile-api.service';

@Injectable()
export class ProfileResolveGuard implements Resolve<any> {

  constructor(private profileService: ProfileApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.paramMap.get('id');

    return  this.getUsrProfile(id);
  }

  getUsrProfile(id: string): Observable<any> {
    return this.profileService.getUsrProfile(id);
  }
}
