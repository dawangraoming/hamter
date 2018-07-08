import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {Hamter} from '../../../hamter';
import {getArticles} from '../../reducers';
import {ArticlesAdd} from '../../actions';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  articles$: Observable<Hamter.ArticleInterface[]> = this.store.select(getArticles);

  constructor(private store: Store<any>) {
  }

  addArticles(params: Hamter.AddArticlesParams) {
    this.store.dispatch(new ArticlesAdd(params));
  }


  dropFile(event: DragEvent) {
    const files = event.dataTransfer.files;
    const articles = Array.from(files).map(item => {
      return {
        article_name: item.name,
        article_local_path: item.path,
        article_remote_path: '',
      };
    });
    this.addArticles({articles, categoryId: 1});
  }

  ngOnInit() {
    document.ondragover = document.ondrop = e => e.preventDefault();
  }

}
