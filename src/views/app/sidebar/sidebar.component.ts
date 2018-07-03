import {Component, OnInit} from '@angular/core';
import {TermsAdd, TermsRemove, TermRename, TermRenameCompleted} from '../../actions';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {Hamter} from '../../../hamter';
import {getTerms, getRenameTermId} from '../../reducers';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  categoryName: string;
  terms$: Observable<Hamter.TermInterface[]> = this.store.select(getTerms);
  renameTermId = 0;
  showContextMenu = false;

  constructor(private store: Store<any>) {
    // add event to listen
    document.body.addEventListener('click', () => this.closeContextMenuMethod());
    this.store.select(getRenameTermId).subscribe((id: number) => this.renameTermId = id);
  }

  addTermMethod() {
    this.store.dispatch(new TermsAdd({
      type: 'category',
      names: [this.categoryName]
    }));
  }

  renameTermMethod(id, ele: HTMLInputElement) {
    if (id === this.renameTermId) {
      return;
    }
    // set store state
    this.store.dispatch(new TermRename({id}));
    // focus input element.
    window.setTimeout(() => ele.focus(), 100);
  }

  closeContextMenuMethod() {
    console.log('click', this);
    this.showContextMenu = false;
  }

  showContextMenuMethod() {
    this.showContextMenu = true;
  }

  removeTermMethod(id: number) {
    this.store.dispatch(new TermsRemove({id: [id]}));
  }

  ngOnInit() {
  }

}
