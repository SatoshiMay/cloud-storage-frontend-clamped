import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { map, mapTo, shareReplay, switchMap, tap, scan, combineLatest } from 'rxjs/operators';

import { GalleryItem, Image } from './image.model';

import { ImageApiService } from '../../service/image-api.service';

import { ActivatedRoute, ParamMap } from '@angular/router';

type IOperation = (acc: GalleryItem[]) => GalleryItem[];

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  public galleryItems$: Observable<GalleryItem[]>;
  private initial$: Observable<GalleryItem[]>;
  private updates$ = new Subject<IOperation>();
  public modalSrc: string;
  public modalDisplay: string;
  public isSelf$: Observable<boolean>;

  constructor(private imgService: ImageApiService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.initial$ = this.route.parent.paramMap.pipe(
      switchMap((params: ParamMap) => this.imgService.getImages(params.get('id'))),
      map((images: Image[]) => images.map(({ src, thumbnail, description }) => ({ src, thumbnail, text: description })))
    );

    this.initial$.subscribe(galleryItems => {
      const operation: IOperation = acc => galleryItems;
      this.updates$.next(operation);
    });

    this.galleryItems$ = this.updates$.pipe(
      scan((acc, operation: IOperation) => operation(acc), []),
      shareReplay()
    );

    this.checkSelf();
  }

  upload(files) {
    const file = files[0];
    const uploaded$: Observable<GalleryItem[]> = this.imgService.getSignedUrl(file.name, file.type).pipe(
      switchMap(({ signedUrl, meta }) => {
        return this.imgService.s3Upload(signedUrl, meta.putParams, file).pipe(mapTo(meta.saveDetails));
      }),
      switchMap(saveDetails => this.imgService.postImage(saveDetails)),
      map(({ url }) => [{ src: url, thumbnail: url, text: 'new image' }])
    );

    uploaded$.subscribe((items: GalleryItem[]) => {
      this.updates$.next(acc => acc.concat(items));
    });
  }

  checkSelf() {
    this.isSelf$ = this.route.root.firstChild.paramMap.pipe(
      combineLatest(this.imgService.getSelfId(), (params: ParamMap, sub: string) => {
        return params.get('id') ? params.get('id') === sub : true;
      })
    );
  }
}
