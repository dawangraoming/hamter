/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/31
 */

import {ActionReducerMap} from '@ngrx/store';

import * as header from './header.reducer';
import * as categories from './category.reducer';
import * as articles from './articles.reducer';

export interface State {
  header: header.HeaderState;
  categories: categories.CategoriesState;
  articles: articles.ArticlesState;
}

export const reducers: ActionReducerMap<State> = {
  header: header.reducer,
  categories: categories.reducer,
  articles: articles.reducer
};

export const getHeaderTitle = (state: State) => state.header.title;

export const getCategoriesList = (state: State) => state.categories.list;

export const getArticlesList = (state: State) => state.articles.list;

