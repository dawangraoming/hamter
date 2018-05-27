import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {getHeaderTitle, State} from '../../reducers';
import {DBService} from '../../db';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title$: Observable<string>;

  constructor(private store: Store<State>, private database: DBService) {
    this.title$ = this.store.select(getHeaderTitle);
  }

  ngOnInit() {
  }

}
