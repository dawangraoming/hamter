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
  thumbCanvasWidth = 500;
  thumbCanvasHeight = 400;
  thumbMaxSize = 500;

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

  generateThumb(img: HTMLImageElement) {
    console.log(img.naturalWidth, img.naturalHeight);
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const canvas = this.thumbCanvas.nativeElement;
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
    ctx.drawImage(img, 0, 0, width, height);
    const dataURL = canvas.toDataURL();
    const name = decodeURIComponent(img.src.replace(/.+\/([\S.]+)$/, '$1'));
    communication.sendEvent({
      channel: 'hamter:saveThumb',
      callback() {
      },
      params: {
        name: name,
        image: dataURL,
      }
    });
  }

  loadMethod(e, isThumb) {
    if (!isThumb) {
      this.generateThumb(e.target);
    }
  }

  ngOnInit() {
    document.ondragover = document.ondrop = e => e.preventDefault();
  }

}
