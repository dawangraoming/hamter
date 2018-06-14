import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {SetHeaderTitleAction, TermsRemove, TermsLoad, TermsAdd, ArticlesAdd, ArticlesLoad} from '../actions';
import {getArticles, getTerms} from '../reducers';

import {Hamter} from '../../hamter';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public name: string;
  public categoryName: string;
  terms$: Observable<Hamter.TermInterface[]>;
  articles$: Observable<Hamter.ArticleInterface[]>;

  constructor(private store: Store<any>) {
    this.terms$ = this.store.select(getTerms);
    this.articles$ = this.store.select(getArticles);
  }

  drapFile(event: DragEvent) {
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

  getTermsAndRelationships() {
    this.store.dispatch(new TermsLoad());
    this.store.dispatch(new ArticlesLoad({termID: 1}));
  }

  addTermMethod() {
    this.store.dispatch(new TermsAdd({
      type: 'category',
      names: [this.categoryName]
    }));
  }

  removeTermMethod(id: number) {
    this.store.dispatch(new TermsRemove({id: [id]}));
  }

  addArticles(params: Hamter.AddArticlesParams) {
    this.store.dispatch(new ArticlesAdd(params));
  }


  inputTestButton() {
    console.log(this.name);
    this.store.dispatch(new SetHeaderTitleAction(this.name));
  }

  dragLeave(e) {
    this.preventDefault(e);
  }

  dragover(e) {
    this.preventDefault(e);
  }

  preventDefault(e: Event) {
    e.preventDefault();
  }

  ngOnInit() {
    document.ondragover = document.ondrop = e => e.preventDefault();
    this.getTermsAndRelationships();
  }
}
