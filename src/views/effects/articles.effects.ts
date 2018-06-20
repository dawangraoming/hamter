/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/8
 */

import {Injectable} from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {catchError, map, mergeMap, switchMap, startWith} from 'rxjs/operators';


import {Hamter} from '../../hamter';
import {ArticlesAddSuccess, ArticlesLoadSuccess, ArticlesTypes, TermsLoadSuccess} from '../actions';

import communication from '../modules/communication';
import {Action} from '@ngrx/store';

@Injectable()
export class ArticlesEffects {
  constructor(private actions$: Actions) {
  }

  @Effect()
  addArticle$: Observable<Action> = this.actions$.pipe(
    ofType(ArticlesTypes.ArticlesAdd),
    map((action: any): any => action.payload),
    switchMap((params) => communication.sendEvent({
        channel: 'hamter:addArticles',
        promise: true,
        params
      })
    ),
    switchMap((params: Hamter.AddArticlesCallbackParams) => [
      new TermsLoadSuccess(params.terms),
      new ArticlesAddSuccess(params.articles)
    ])
  );


  @Effect()
  loadArticles$: Observable<Action> = this.actions$.pipe(
    ofType(ArticlesTypes.ArticlesLoad),
    map((action: any): any => action.payload),
    switchMap((params) => communication.sendEvent({
        channel: 'hamter:getArticlesOfTerm',
        promise: true,
        params
      })
    ),
    map((params: Hamter.ArticleInterface[]) => new ArticlesLoadSuccess(params))
  );
}
