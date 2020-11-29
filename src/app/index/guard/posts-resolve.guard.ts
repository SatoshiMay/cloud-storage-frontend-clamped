import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { PostApiService } from '../service/post-api.service';
import { Post } from '../dashboard/posts/post.model';

const POSTS_PER_PAGE = 5;

@Injectable()
export class PostsResolveGuard implements Resolve<Post[]> {
  id: string;

  constructor(private postService: PostApiService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post[]> {
    this.id = route.parent.paramMap.get('id');
    return this.getPosts();
  }

  getPosts(page: number = 0): Observable<Post[]> {
    return this.postService.getPosts(this.id, page, POSTS_PER_PAGE);
  }
}
