/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/8
 */


import {Action} from '@ngrx/store';

export enum ArticlesTypes {
  ArticlesList = '[Articles] List',
  ArticlesRemove = '[Articles] Remove',
  ArticlesAdd = '[Articles] Add',
  ArticlesReset = '[Articles] Reset'
}

export interface ArticleInterface {
  id: string;
  name: string;
  path: string;
  category: {
    id: string
  };
  createdTime: number;
}

export class AddArticlesAction implements Action {
  readonly type = ArticlesTypes.ArticlesAdd;

  constructor(public payload: ArticleInterface[]) {
  }
}

interface RemoveArticlesInterface {
  id: number;
}

export class RemoveArticlesAction implements Action {
  readonly type = ArticlesTypes.ArticlesRemove;

  constructor(public payload: RemoveArticlesInterface) {
  }
}

export class ResetArticlesAction implements Action {
  readonly type = ArticlesTypes.ArticlesReset;
}


export type ArticlesActions = AddArticlesAction
  | RemoveArticlesAction
  | ResetArticlesAction;
