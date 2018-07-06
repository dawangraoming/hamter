import {Component, OnInit, ElementRef, ViewChildren, QueryList} from '@angular/core';
import {TermsAdd, TermsRemove, TermRename, TermRenameCompleted} from '../../actions';
import {Store} from '@ngrx/store';
import {Observable, fromEvent} from 'rxjs';
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
  termRenameId$: Observable<number> = this.store.select(getRenameTermId);
  renameTermId = 0;
  contextMenuShow = false;
  contextMenuOnTermId = 0;
  inputCategoryNameEvent = null;
  @ViewChildren('inputCategoryName') inputList: QueryList<ElementRef>;
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
      names: [this.categoryName]
    }));
  }

  renameTermMethod(event, id: number) {
    if (id === this.renameTermId) {
      return;
    }
    // set store state
    this.store.dispatch(new TermRename({id}));
    const inputEle = this.inputList.find(item => {
      return parseInt((<HTMLInputElement>item.nativeElement).getAttribute('data-id'), 10) === id;
    }).nativeElement;
    // add an event listener to watch input and trigger the callback when it loses focus
    this.inputCategoryNameEvent = fromEvent(inputEle, 'blur').subscribe(this.renameTermCompletedMethod.bind(this));
    // focus input element.
    window.setTimeout(() => inputEle.focus(), 50);
  }

  renameTermCompletedMethod(event: Event) {
    this.store.dispatch(new TermRenameCompleted({
      term_id: this.renameTermId,
      term_name: (<HTMLInputElement>event.srcElement).value
    }));
  }

  renameInputKeyUpMethod(event: KeyboardEvent) {
    if (event.keyCode === 13 || event.keyCode === 27) {
      this.inputCategoryNameEvent.unsubscribe();
      this.renameTermCompletedMethod(event);
    }
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

  removeTermMethod(event, id: number) {
    if (id) {
      this.store.dispatch(new TermsRemove({id: [id]}));
    }
  }

  ngOnInit() {
  }

}
