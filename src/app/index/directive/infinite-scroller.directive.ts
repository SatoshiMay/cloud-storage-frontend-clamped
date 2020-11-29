import { Directive, AfterViewInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { pairwise, map, filter, startWith, tap } from 'rxjs/operators';

interface ScrollPosition {
  sH: number;
  sT: number;
  cH: number;
}

const DEFAULT_SCROLL_POSITION: ScrollPosition = {
  sH: 0,
  sT: 0,
  cH: 0
};

@Directive({
  selector: '[appInfiniteScroller]'
})
export class InfiniteScrollerDirective implements AfterViewInit {

  private scrollEvent$: Observable<any>;
  private scrolledDown$: Observable<ScrollPosition[]>;
  private scrolled$;

  @Input() immediateCallback = false;
  @Input() scrollPercent = 70;
  @Output() scrolled = new EventEmitter();

  // constructor(private elm: ElementRef) { }
  constructor(@Inject(DOCUMENT) private document: any) { }

  ngAfterViewInit() {
    this.startListening();
    this.createScrolledStream();
    this.emitScrolledEvent();
  }

  private startListening() {
    this.scrollEvent$ = fromEvent(this.document, 'scroll');
  }

  private createScrolledStream() {
    this.scrolledDown$ = this.scrollEvent$.pipe(
      // tap(e => console.log(e)),
      map((e: any): ScrollPosition => ({
        sH: e.target.scrollingElement.scrollHeight,
        sT: e.target.scrollingElement.scrollTop,
        cH: e.target.scrollingElement.clientHeight
      })),
      pairwise(),
      filter(positions => this.isUserScrollingDown(positions) && this.isScrollExpectedPercent(positions[1])),
      // tap(positions => console.log(positions))
    );
  }

  private emitScrolledEvent() {
    this.scrolled$ = this.scrolledDown$;
    if (this.immediateCallback) {
      this.scrolled$ = this.scrolled$.pipe(
        startWith([DEFAULT_SCROLL_POSITION, DEFAULT_SCROLL_POSITION])
      );
    }

    this.scrolled$.subscribe(() => { this.scrolled.emit(); });
  }

  private isUserScrollingDown = (positions) => {
    return positions[0].sT < positions[1].sT;
  }

  private isScrollExpectedPercent = (position) => {
    return ((position.sT + position.cH) / position.sH) > (this.scrollPercent / 100);
  }

}
