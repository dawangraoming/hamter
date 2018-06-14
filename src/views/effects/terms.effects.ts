/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/6/4
 */


import {Injectable} from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';


import {Hamter} from '../../hamter';
import {TermsAddSuccess, TermsLoadSuccess, TermsRemoveSuccess, TermTypes} from '../actions';

import communication from '../modules/communication';

@Injectable()
export class TermsEffects {
  constructor(private actions$: Actions) {

  }

  @Effect()
  getTermAndRelationships$: Observable<any> = this.actions$.pipe(
    ofType(TermTypes.Load),
    mergeMap(() => communication.sendEvent({
        channel: 'hamter:getTermsAndRelationships',
        promise: true
      }),
    ),
    map((data: Hamter.GetTermsAndRelationshipsParams) => new TermsLoadSuccess(data.terms)),
    catchError(() => of(console.log('error')))
  );


  @Effect()
  addTerms$: Observable<any> = this.actions$.pipe(
    ofType(TermTypes.Add),
    map((action: any): any => action.payload),
    mergeMap((params) => communication.sendEvent({
        channel: 'hamter:addTerms',
        promise: true,
        params
      })
    ),
    map((data: Hamter.TermInterface[]) => new TermsAddSuccess(data)),
    catchError(() => of(console.log('error')))
  );

  @Effect()
  removeTerms$: Observable<any> = this.actions$.pipe(
    ofType(TermTypes.Remove),
    map((action: any): any => {
      console.log(action);
      return action.payload;
    }),
    mergeMap((params) => communication.sendEvent({
        channel: 'hamter:removeTerms',
        promise: true,
        params
      })
    ),
    map((id: number[]) => new TermsRemoveSuccess({id})),
    catchError(() => of(console.log('error')))
  );
}

