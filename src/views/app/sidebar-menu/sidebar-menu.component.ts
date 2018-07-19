import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {getRenameTermId, getSelectedTermId} from '../../reducers';
import {Store, select} from '@ngrx/store';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {


  @Input() menuTreeData: any[];
  @Input() contextMenuMethod: (...arg: any[]) => any;
  @Input() clickMethod: (...arg: any[]) => any;
  @Input() nameInputCompletedMethod: (...arg: any[]) => any;

  renameTermId = 0;
  selectedTermId = 0;
  contextMenuOnTermId = 0;

  constructor(private store: Store<any>) {
    this.store.pipe(select(getRenameTermId)).subscribe((id: number) => this.renameTermId = id);
    this.store.pipe(select(getSelectedTermId)).subscribe((id: number) => this.selectedTermId = id);
  }

  ngOnInit() {
  }

}
