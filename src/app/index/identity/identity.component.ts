import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.scss']
})
export class IdentityComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
