/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/4
 */

import {Action} from '@ngrx/store';


export enum CategoryTypes {
  CategoryList = '[Category] List',
  CategoryRemove = '[Category] Remove',
  CategoryAdd = '[Category] Add',
  CategoryReset = '[Category] Reset'
}

export interface CategoryInterface {
  createdTime: number;
  name: string;
  id: string;
  index: number;
}

export class AddCategoryAction implements Action {
  readonly type = CategoryTypes.CategoryAdd;

  constructor(public payload: CategoryInterface[]) {
  }
}

interface CategoryRemoveInterface {
  id: number;
}

export class RemoveCategoryAction implements Action {
  readonly type = CategoryTypes.CategoryRemove;

  constructor(public payload: CategoryRemoveInterface) {
  }
}

export class ResetCategoryAction implements Action {
  readonly type = CategoryTypes.CategoryReset;
}

export type CategoryActions = AddCategoryAction
  | RemoveCategoryAction
  | ResetCategoryAction;


