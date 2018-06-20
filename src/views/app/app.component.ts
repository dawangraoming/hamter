import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
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


  constructor(private store: Store<any>) {
  }


  getTermsAndRelationships() {
    this.store.dispatch(new TermsLoad());
    this.store.dispatch(new ArticlesLoad({termID: 1}));
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
