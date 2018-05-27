import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store, select} from '@ngrx/store';
import {SetHeaderTitleAction, AddCategoryAction, RemoveCategoryAction, CategoryInterface, AddArticlesAction} from '../actions';
import {getCategoriesList} from '../reducers';
import {dataDemo, DBService} from '../db';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public name: string;
  categoryName: string;
  categoriesList$: Observable<CategoryInterface[]>;

  constructor(private database: DBService, private store: Store<any>) {
    this.categoriesList$ = this.store.select(getCategoriesList);
  }

  drapFile(event: DragEvent) {
    const files = event.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

    }
  }

  testAddCate() {
    const createdTime = Date.now();
    const id = Math.random().toString(16);
    const index = -1;

    this.store.dispatch(new AddCategoryAction([{createdTime, id, index, name: this.categoryName}]));
  }

  testAddArt() {
    const createdTime = Date.now();
    const id = Math.random().toString(16);
    const index = -1;
    console.log('test testAddArt');
    this.store.dispatch(new AddArticlesAction([{createdTime, id, name: this.categoryName, path: '', category: null}]));
  }

  testClickDB() {
    dataDemo();
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
  }
}
