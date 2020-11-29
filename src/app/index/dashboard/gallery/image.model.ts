export interface GalleryItem {
  src?: string;
  thumbnail?: string;
  text?: string;
}

export class Image implements GalleryItem {
  src: string;
  description: string;
  thumbnail: string;
}
