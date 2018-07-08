import {Component, OnInit} from '@angular/core';
import {TermsAdd, TermsRemove, TermRename, TermRenameCompleted} from '../../actions';
import {Store} from '@ngrx/store';
import {Observable, fromEvent} from 'rxjs';
import {Hamter} from '../../../hamter';
import {getTerms, getRenameTermId} from '../../reducers';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  categoryName: string;
  terms$: Observable<Hamter.TermInterface[]> = this.store.select(getTerms);
  // termRenameId$: Observable<number> = this.store.select(getRenameTermId);
  renameTermId = 0;
  contextMenuShow = false;
  contextMenuOnTermId = 0;
  contextMenuStyle = {
    left: '0',
    top: '0',
  };

  constructor(private store: Store<any>) {
    // add event listener to close the context menu when document mouse down and window loses focus
    fromEvent(window, 'blur').subscribe(this.closeCtxMenuAndResetMethod.bind(this));
    fromEvent(window, 'contextmenu').subscribe(this.closeCtxMenuAndResetMethod.bind(this));
    fromEvent(document, 'click').subscribe(this.closeCtxMenuAndResetMethod.bind(this));
    // get term id on the rename state, if rename id will be 0, that means no have term on rename
    this.store.select(getRenameTermId).subscribe((id: number) => this.renameTermId = id);
  }

  addTermMethod() {
    this.store.dispatch(new TermsAdd({
      type: 'category',
      names: ['自定义分类']
    }));
  }

  renameTermMethod() {
    const id = this.contextMenuOnTermId;
    // set store state
    this.store.dispatch(new TermRename({id}));
  }

  renameTermCompletedMethod(data) {
    if (data.hasChanged) {
      this.store.dispatch(new TermRenameCompleted({
        term_name: data.term_name,
        term_id: data.term_id
      }));
    }
    this.store.dispatch(new TermRename({id: 0}));
  }

  closeCtxMenuAndResetMethod() {
    this.contextMenuShow = false;
  }

  showContextMenuMethod(event: MouseEvent, id?: number) {
    this.contextMenuStyle.left = event.x + 'px';
    this.contextMenuStyle.top = event.y + 'px';
    this.contextMenuOnTermId = id ? id : 0;
    this.contextMenuShow = true;
    event.stopPropagation();
    event.preventDefault();
  }

  // remove a term
  removeTermMethod() {
    this.store.dispatch(new TermsRemove({id: [this.contextMenuOnTermId]}));
  }

  ngOnInit() {
  }

}
