import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { FriendApiService } from '../../service/friend-api.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  friends$: any;

  constructor(private route: ActivatedRoute, private router: Router,
    private friendService: FriendApiService) { }

  ngOnInit() {
    this.friends$ = this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => this.friendService.getFriends(params.get('id')))
    );
  }

  clicked(id: string) {
    this.router.navigate(['/users', id]);
  }

}
