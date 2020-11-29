import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loading = true;
  start: number;
  stop: number;
  constructor(private router: Router) {
    this.router.events.subscribe(event => this.checkRouterEvent(event));
  }

  checkRouterEvent(event) {
    const HOME_REDIRECT = 'posts';
    const HOME_URI_TREE_DEPTH = 3;
    if (event instanceof NavigationStart) {
      const uris = event.url.split('/');
      const showSpinner = (uris.length === HOME_URI_TREE_DEPTH) ||
        (uris[uris.length - 1] === HOME_REDIRECT);
      if (showSpinner) {
        this.loading = true;
        this.start = Date.now();
      }
    }
    if (event instanceof NavigationEnd ||
      event instanceof NavigationError ||
      event instanceof NavigationCancel) {
      if (!this.router.parseUrl(event.url).fragment) { window.scrollTo(0, 0); }
      setTimeout(() => this.loading = false, Math.max(0, this.start + 450 - Date.now()));
    }
  }
}
