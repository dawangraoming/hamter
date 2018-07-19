import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {getHeaderTitle, State} from '../../reducers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  title$: Observable<string>;

  constructor(private store: Store<State>) {
    this.title$ = this.store.pipe(select(getHeaderTitle));
  }

  ngOnInit() {
  }

}
