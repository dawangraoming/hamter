/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/8
 */

import {Injectable} from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';

import {ArticlesTypes} from '../actions';
import {map, mergeMap} from 'rxjs/operators';


@Injectable()
export class ArticlesEffects {
  constructor(private actions$: Actions) {
    console.log('Effect 实例化', this.actions$);
  }

  @Effect()
  addArticle$: Observable<any> = this.actions$.pipe(
    ofType(ArticlesTypes.ArticlesAdd),
    map((action: any) => {

      console.log('Effect 测试测试', arguments);
      return action.payload;
    }),
    mergeMap(data => {
      console.log('asdasdasd', arguments);
      return data;
    })
  );
}
