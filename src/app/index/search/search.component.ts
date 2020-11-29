import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { switchMap, startWith, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { SearchApiService } from '../service/search-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  term = new FormControl('');
  search$ = new Subject<any>();
  users$: Observable<any>;

  constructor(private searchService: SearchApiService, private router: Router) { }

  ngOnInit() {
    this.users$ = this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        term ? this.searchService.getUsers(term) : of([])), // clear if term is empty string
    );
  }

  search() {
    this.search$.next(this.term.value);
  }

  clicked(id: string) {
    this.router.navigate(['/users', id]);
    this.search$.next(null);
  }

  clear() {
    this.term.setValue('');
    this.search$.next(null);
  }
}
