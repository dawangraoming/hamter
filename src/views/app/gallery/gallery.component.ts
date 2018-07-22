import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Hamter} from '../../../hamter';
import {getArticles} from '../../reducers';
import {ArticlesAdd} from '../../actions';
import communication from '../../modules/communication';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  articles$: Observable<Hamter.ArticleInterface[]> = this.store.select(getArticles);

  @ViewChild('thumbCanvas') thumbCanvas: ElementRef<HTMLCanvasElement>;
  thumbMaxSize = 1000;

  constructor(private store: Store<any>) {
  }

  addArticles(params: Hamter.AddArticlesParams) {
    this.store.dispatch(new ArticlesAdd(params));
  }

  dropFile(event: DragEvent) {
    const files = event.dataTransfer.files;
    console.log(files);
    const articles = Array.from(files).map(item => {
      return {
        name: item.name,
        path: item.path,
      };
    });
    this.addArticles({articles, categoryId: 1});
  }

  loadFile(event) {
  }

  /**
   * create thumbnail image from canvas, send base64 image to main process and generate file
   * @param {HTMLImageElement} img
   */
  generateThumb(img: HTMLImageElement) {
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const canvas = document.createElement('canvas');
    let width, height;
    if (naturalW >= naturalH) {
      width = this.thumbMaxSize;
      height = this.thumbMaxSize / naturalW * naturalH;
    } else {
      width = this.thumbMaxSize / naturalH * naturalW;
      height = this.thumbMaxSize;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    // set the high quality of image
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);
    const base64 = canvas.toDataURL('image/webp');
    canvas.remove();
    // return image base64
    return base64;
  }

  getImageSize(img: HTMLImageElement) {
    return {
      width: img.naturalWidth,
      height: img.naturalHeight
    };
  }

  generateArticleData(img: HTMLImageElement, id: number, name: string) {
    const base64 = this.generateThumb(img);
    const imageSize = this.getImageSize(img);
    // return console.log(this.getFilType(img));
    communication.sendEvent({
      channel: 'hamter:initArticle',
      callback() {
      },
      params: {
        ...imageSize,
        image: base64,
        id,
        name,
      }
    });
  }

  // getFilType(img: HTMLImageElement) {
  //   const canvas = document.createElement('canvas');
  //   canvas.width = img.naturalWidth;
  //   canvas.height = img.naturalHeight;
  //   const ctx = canvas.getContext('2d');
  //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  //   const uint8Array = this.convertDataURIToBinaryFF(canvas.toDataURL());
  //   canvas.remove();
  //   return fileType(uint8Array);
  // }
  //
  //
  // convertDataURIToBinaryFF(dataURI) {
  //   const BASE64_MARKER = ';base64,';
  //   const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  //   const raw = window.atob(dataURI.substring(base64Index));
  //   return Uint8Array.from(Array.prototype.map.call(raw, function (x) {
  //     return x.charCodeAt(0);
  //   }));
  // }


  loadMethod(e, article) {
    const isThumb = !!article.article_thumb_path;
    if (!isThumb) {
      this.generateArticleData(e.target, article.article_id, article.article_name);
    }
  }

  ngOnInit() {
    document.ondragover = document.ondrop = e => e.preventDefault();
  }

}
