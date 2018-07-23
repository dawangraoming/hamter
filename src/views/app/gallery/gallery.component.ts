import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Hamter} from '../../../hamter';
import {getArticles, getSelectedArticles} from '../../reducers';
import {ArticlesAdd, ArticlesRemove, ArticlesSelect, ArticlesUpdate} from '../../actions';
import communication from '../../modules/communication';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  articles$: Observable<Hamter.ArticleInterface[]> = this.store.select(getArticles);
  articlesSelected$: Observable<number[]> = this.store.select(getSelectedArticles);

  @ViewChild('thumbCanvas') thumbCanvas: ElementRef<HTMLCanvasElement>;
  thumbMaxSize = 1000;

  constructor(private store: Store<any>) {
  }

  addArticles(params: Hamter.AddArticlesParams) {
    this.store.dispatch(new ArticlesAdd(params));
  }

  removeArticles(params: Hamter.RemoveArticlesParams) {
    this.store.dispatch(new ArticlesRemove(params.articleId));
  }

  selectArticles(articleId: number | number[]) {
    this.store.dispatch(new ArticlesSelect({articleId: articleId instanceof Array ? articleId : [articleId]}));
  }

  dropFile(event: DragEvent) {
    const files = event.dataTransfer.files;
    const articles = Array.from(files).map(item => {
      return {
        name: item.name,
        path: item.path,
      };
    });
    this.addArticles({articles, categoryId: 1});
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
    // set output image's width and height
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
      callback: (e, data) => {
        this.store.dispatch(new ArticlesUpdate(data instanceof Array ? data : [data]));
      },
      params: {
        ...imageSize,
        image: base64,
        id,
        name,
      }
    });
  }

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
