import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/index';
import {Hamter} from '../../../hamter';
import {getSelectedArticles} from '../../reducers';
import {select, Store} from '@ngrx/store';
import {getThumbPath} from '../../modules/get-thumb-path';

@Component({
  selector: 'app-details-bar',
  templateUrl: './details-bar.component.html',
  styleUrls: ['./details-bar.component.scss']
})
export class DetailsBarComponent implements OnInit {
  articlesSelected$: Observable<Hamter.ArticleInterface[]> = this.store.pipe(select(getSelectedArticles));
  firstSelectArticle: Hamter.ArticleInterface;
  getThumbPath: (p: Hamter.ArticleInterface) => string;

  constructor(private store: Store<any>) {
    // set the first article to use
    this.store.pipe(select(getSelectedArticles)).subscribe(value => this.firstSelectArticle = value.length > 0 ? value[0] : null);

    this.getThumbPath = getThumbPath;
  }

  ngOnInit() {
  }
}
