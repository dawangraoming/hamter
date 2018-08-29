import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {TermsLoad, ArticlesLoad, TermSelect} from '../actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<any>) {
  }

  getTermsAndRelationships() {
    this.store.dispatch(new TermsLoad());
    this.store.dispatch(new TermSelect(1));
  }

  ngOnInit() {
    this.getTermsAndRelationships();
  }
}
