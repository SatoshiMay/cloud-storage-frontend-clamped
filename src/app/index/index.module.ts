import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IndexRoutingModule } from './index-routing.module';

import { IndexComponent } from './index.component';
import { IdentityComponent } from './identity/identity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GalleryComponent } from './dashboard/gallery/gallery.component';
import { SearchComponent } from './search/search.component';
import { FriendsComponent } from './dashboard/friends/friends.component';
import { ModalComponent } from './dashboard/gallery/modal/modal.component';
import { PostsComponent } from './dashboard/posts/posts.component';

import { ImageApiService } from './service/image-api.service';
import { SearchApiService } from './service/search-api.service';
import { FriendApiService } from './service/friend-api.service';
import { ProfileApiService } from './service/profile-api.service';
import { PostApiService } from './service/post-api.service';

import { ProfileResolveGuard } from './guard/profile-resolve.guard';
import { PostsResolveGuard } from './guard/posts-resolve.guard';

import { InfiniteScrollerDirective } from './directive/infinite-scroller.directive';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IndexRoutingModule
  ],
  declarations: [
    IndexComponent, IdentityComponent, DashboardComponent, GalleryComponent,
    SearchComponent, FriendsComponent, ModalComponent, PostsComponent,
    InfiniteScrollerDirective,
  ],
  providers: [
    ImageApiService, SearchApiService, FriendApiService, ProfileApiService, PostApiService,
    ProfileResolveGuard,
    PostsResolveGuard
  ]
})
export class IndexModule { }
