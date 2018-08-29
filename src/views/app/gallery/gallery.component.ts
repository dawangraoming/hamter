import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Hamter} from '../../../hamter';
import {getArticles, getSelectedArticles, getSelectedTermId} from '../../reducers';
import {ArticlesAdd, ArticlesRemove, ArticlesSelect, ArticlesSelectReset, ArticlesUpdate} from '../../actions';
import communication from '../../modules/communication';
import {fromEvent} from 'rxjs/index';
import {getThumbPath} from '../../modules/get-thumb-path';


@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  articles$: Observable<Hamter.ArticleInterface[]> = this.store.select(getArticles);
  articlesSelected$: Observable<Hamter.ArticleInterface[]> = this.store.select(getSelectedArticles);
  selectedTermId = 0;
  articlesSelected = [];
  thumbMaxSize = 1000;
  contextMenuShow = false;
  contextMenuStyle = {
    left: '0',
    top: '0',
  };
  clickFromArticle = false;
  getThumbPath: (p: Hamter.ArticleInterface) => string;

  constructor(private store: Store<any>) {
    // add event listener to close the context menu when document mouse down and window loses focus
    fromEvent(window, 'blur').subscribe(this.closeCtxMenuAndResetMethod.bind(this));
    fromEvent(window, 'contextmenu').subscribe(this.closeCtxMenuAndResetMethod.bind(this));
    fromEvent(document, 'click').subscribe(this.closeCtxMenuAndResetMethod.bind(this));

    this.store.select(getSelectedArticles).subscribe(value => this.articlesSelected = value);
    this.store.select(getSelectedTermId).subscribe((id: number) => this.selectedTermId = id);
    this.getThumbPath = getThumbPath;
  }

  /**
   * add articles;
   * @param {Hamter.AddArticlesParams} params
   */
  addArticles(params: Hamter.AddArticlesParams) {
    this.store.dispatch(new ArticlesAdd(params));
  }

  /**
   * remove articles
   */
  removeArticles() {
    this.store.dispatch(new ArticlesRemove({articleId: this.articlesSelected.map(item => item.article_id)}));
  }

  /**
   * select articles
   * @param {Hamter.ArticleInterface | Hamter.ArticleInterface[]} articles
   */
  selectArticles(articles: Hamter.ArticleInterface[] | Hamter.ArticleInterface) {
    this.store.dispatch(new ArticlesSelect(Array.isArray(articles) ? articles : [articles]));
  }

  /**
   * support drag file to add articles
   * @param {DragEvent} event
   */
  dropFile(event: DragEvent) {
    const files = event.dataTransfer.files;
    const articles = Array.from(files).map(item => {
      return {
        name: item.name,
        path: item.path,
      };
    });
    this.addArticles({articles, categoryId: this.selectedTermId});
  }

  clickArticleMethod(event, articles) {
    this.clickFromArticle = true;
    this.selectArticles(articles);
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

  /**
   * generate thumbnail by canvas, get image real width and height
   * @param {HTMLImageElement} img
   * @param {number} id
   * @param {string} name
   */
  generateArticleData(img: HTMLImageElement, id: number, name: string) {
    const base64 = this.generateThumb(img);
    const imageSize = this.getImageSize(img);
    // return console.log(this.getFilType(img));
    communication.sendEvent({
      channel: 'hamter:initArticle',
      callback: (e, data) => {
        this.store.dispatch(new ArticlesUpdate(Array.isArray(data) ? data : [data]));
      },
      params: {
        ...imageSize,
        image: base64,
        id,
        name,
      }
    });
  }

  /**
   * image load method, call generateArticleData function if image is first load
   * @param e
   * @param {Hamter.ArticleInterface} article
   */
  loadMethod(e, article: Hamter.ArticleInterface) {
    const isThumb = !!article.article_thumb_path;
    if (!isThumb) {
      this.generateArticleData(e.target, article.article_id, article.article_name);
    }
  }

  clickOnGallery() {
    if (this.clickFromArticle) {
    } else {
      this.store.dispatch(new ArticlesSelectReset());
    }
    this.clickFromArticle = false;
  }

  rightClickOnGallery(event) {
    if (this.clickFromArticle) {
      this.showContextMenuMethod(event);
    } else {
      this.store.dispatch(new ArticlesSelectReset());
    }
    this.clickFromArticle = false;
  }


  /**
   * show the context menu
   * @param {MouseEvent} event
   */
  showContextMenuMethod(event: MouseEvent) {
    this.contextMenuStyle.left = event.x + 'px';
    this.contextMenuStyle.top = event.y + 'px';
    this.contextMenuShow = true;
    event.stopPropagation();
    event.preventDefault();
  }

  closeCtxMenuAndResetMethod() {
    this.contextMenuShow = false;
  }

  ngOnInit() {
    document.ondragover = document.ondrop = e => e.preventDefault();
  }

}
