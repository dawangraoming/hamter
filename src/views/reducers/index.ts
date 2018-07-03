/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/31
 */

import {ActionReducerMap} from '@ngrx/store';

import * as header from './header.reducer';
import * as terms from './terms.reducer';
import * as articles from './articles.reducer';

export interface State {
  header: header.HeaderState;
  terms: terms.TermsState;
  articles: articles.ArticlesState;
}

export const reducers: ActionReducerMap<State> = {
  header: header.reducer,
  terms: terms.reducer,
  articles: articles.reducer
};

export const getHeaderTitle = (state: State) => state.header.title;

export const getTerms = (state: State) => state.terms.terms;
export const getRenameTermId = (state: State) => state.terms.renameId;

export const getArticles = (state: State) => state.articles.articles;

