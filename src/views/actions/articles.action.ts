/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/8
 */


import {Action} from '@ngrx/store';

import {Hamter} from '../../hamter';


export enum ArticlesTypes {
  ArticlesLoad = '[Articles] Load',
  ArticlesLoadSuccess = '[Articles] Load Success',
  ArticlesRemove = '[Articles] Remove',
  ArticlesRemoveSuccess = '[Articles] Remove Success',
  ArticlesAdd = '[Articles] Add',
  ArticlesAddSuccess = '[Articles] Add Success',
  ArticlesUpdate = '[Articles] Update',
  ArticlesReset = '[Articles] Reset'
}

export class ArticlesLoad implements Action {
  readonly type = ArticlesTypes.ArticlesLoad;

  constructor(public payload: Hamter.GetArticlesOfTermParams) {

  }
}

export class ArticlesLoadSuccess implements Action {
  readonly type = ArticlesTypes.ArticlesLoadSuccess;

  constructor(public payload: Hamter.ArticleInterface[]) {

  }
}

export class ArticlesAdd implements Action {
  readonly type = ArticlesTypes.ArticlesAdd;

  constructor(public payload: Hamter.AddArticlesParams) {
  }
}

export class ArticlesAddSuccess implements Action {
  readonly type = ArticlesTypes.ArticlesAddSuccess;

  constructor(public payload: Hamter.ArticleInterface[]) {

  }
}


export class ArticlesRemove implements Action {
  readonly type = ArticlesTypes.ArticlesRemove;

  constructor(public payload: number[]) {
  }
}

export class ArticlesRemoveSuccess implements Action {
  readonly type = ArticlesTypes.ArticlesRemoveSuccess;

  constructor(public payload: number[]) {

  }
}

export class ArticlesUpdate implements Action {
  readonly type = ArticlesTypes.ArticlesUpdate;

  constructor(public payload: Hamter.ArticleInterface[]) {
  }
}

export class ResetArticlesAction implements Action {
  readonly type = ArticlesTypes.ArticlesReset;
}


export type ArticlesActions = ArticlesLoad
  | ArticlesLoadSuccess
  | ArticlesAdd
  | ArticlesAddSuccess
  | ArticlesRemove
  | ArticlesRemoveSuccess
  | ArticlesUpdate;
