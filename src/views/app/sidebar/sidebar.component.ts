import {Component, OnInit} from '@angular/core';
import {TermsAdd, TermsRemove} from '../../actions';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Hamter} from '../../../hamter';
import {getTerms} from '../../reducers';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public categoryName: string;
  terms$: Observable<Hamter.TermInterface[]> = this.store.select(getTerms);

  constructor(private store: Store<any>) {
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

  ngOnInit() {
  }

}
