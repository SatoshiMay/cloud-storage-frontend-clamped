import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IndexComponent } from './index.component';

import { AuthGuard } from '../auth/auth.guard';
import { AnonymousGuard } from '../auth/anonymous.guard';
import { ProfileResolveGuard } from './guard/profile-resolve.guard';

import { environment } from '../../environments/environment';
import { FriendsComponent } from './dashboard/friends/friends.component';
import { GalleryComponent } from './dashboard/gallery/gallery.component';
import { PostsComponent } from './dashboard/posts/posts.component';
import { PostsResolveGuard } from './guard/posts-resolve.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const indexChildRoutes: Routes = [
  {
    path: '', component: DashboardComponent,
    resolve: { profile: ProfileResolveGuard },
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: PostsComponent, resolve: { posts: PostsResolveGuard } },
      { path: 'friends', component: FriendsComponent },
      { path: 'gallery', component: GalleryComponent }
    ]
  }
];

const indexRoutes: Routes = [
  {
    path: 'users/:id', component: IndexComponent, canActivate: [AuthGuard],
    children: indexChildRoutes
  },
  {
    path: '', component: IndexComponent, canActivate: [AuthGuard],
    children: indexChildRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(indexRoutes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
