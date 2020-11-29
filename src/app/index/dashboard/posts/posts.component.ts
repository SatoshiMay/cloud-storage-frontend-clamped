import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';

import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, switchMap, tap, take, scan, throttle, withLatestFrom, filter } from 'rxjs/operators';

import { PostApiService } from '../../service/post-api.service';
import { Post } from './post.model';

type IOperation = (acc: Post[]) => Post[];
const POSTS_PER_PAGE = 5;

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, AfterViewInit {
  reply = new FormControl();

  private page = 0;
  private initial$: Observable<Post[]>;
  private scrolled$ = new Subject();
  private updates$ = new ReplaySubject<IOperation>(1);
  public posts$: Observable<Post[]>;
  private paused$ = new BehaviorSubject<boolean>(false);

  constructor(private route: ActivatedRoute, private postService: PostApiService,
    private router: Router) {
  }

  ngOnInit() {
    this.route.parent.paramMap.subscribe(() => {
      this.page = 0;
      this.paused$.next(false); // resume upon new params
    });

    this.initial$ = this.route.data.pipe(
      map((data: { posts: Post[] }) => data.posts),
      map(posts => posts ? posts : []) // map null to empty array in case of api error
    );
    this.initial$.pipe(
      map<Post[], IOperation>(posts => acc => posts),
    ).subscribe(this.updates$);

    this.scrolled$.pipe(
      withLatestFrom(this.paused$),
      filter(([_, paused]) => !paused),
      throttle(() => this.getPosts(++this.page).pipe(
        take(1), // complete after one emission
        tap(posts => {
          if (posts !== null && posts.length < POSTS_PER_PAGE) { // no error and server returns less than limit
            this.paused$.next(true); // pause infinite scroll
          }
        }),
        map(posts => posts ? posts : []), // map null to empty array in case of api error
        map<Post[], IOperation>(posts => acc => acc.concat(posts)),
        tap(operation => this.updates$.next(operation as IOperation))
      ))
    ).subscribe();

    this.posts$ = this.updates$.pipe( // use replaysubject due to late subscription to resolved data
      scan((acc, operation: IOperation) => operation(acc), [])
    );
  }

  ngAfterViewInit() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const tree = this.router.parseUrl(e.url);
        if (tree.fragment) {
          const el = document.querySelector('#' + tree.fragment);
          if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); } // WARNING
        }
      }
    });
  }

  onScroll() {
    // console.log('scrolled');
    this.scrolled$.next();
  }

  getPosts(page: number = 0): Observable<Post[]> {
    return this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => this.postService.getPosts(params.get('id'), page, POSTS_PER_PAGE)),
    );
  }

  submit(id: string) {
    this.postService.postReply(id, this.reply.value).pipe(
      tap(() => this.reply.reset()),
      map<Post, IOperation>(res =>
        res ? // check if null due to api error
          acc => {
            const pId = acc.findIndex(post => post._id === res.replyTo);
            acc[pId].replies.push(res);
            return acc;
          }
          : acc => acc), // map to identity operation
    ).subscribe(operation => this.updates$.next(operation)); // dont want updates$ to complete so push only to next
  }

}
