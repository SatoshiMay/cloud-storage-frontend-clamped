import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { IndexModule } from './index/index.module';

import { WelcomeComponent } from './welcome/welcome.component';

import { AnonymousGuard } from './auth/anonymous.guard';

import { environment } from '../environments/environment';

// export function _indexModuleLoader () {
//   return IndexModule;
// }

const appRoutes: Routes = [
  { path: 'welcome', component: WelcomeComponent, canActivate: [AnonymousGuard] }
  // { path: '', loadChildren: _indexModuleLoader },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: environment.production ? false : false }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
