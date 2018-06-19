import {Component, OnInit} from '@angular/core';
import {TermsAdd, TermsRemove} from '../../actions';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Hamter} from '../../../hamter';
import {getTerms} from '../../reducers';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

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
