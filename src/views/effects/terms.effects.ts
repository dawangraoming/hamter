/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/6/4
 */


import {Injectable} from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';


import {Hamter} from '../../hamter';
import {TermsAddSuccess, TermsLoadSuccess, TermsRemoveSuccess, TermTypes, TermRenameSuccess, TermRename} from '../actions';

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
    switchMap((data: Hamter.TermInterface[]) => [
      new TermsAddSuccess(data),
      new TermRename({id: data[0].term_id})
    ]),
    catchError(() => of(console.log('error')))
  );

  @Effect()
  removeTerms$: Observable<any> = this.actions$.pipe(
    ofType(TermTypes.Remove),
    map((action: any): any => action.payload),
    mergeMap((params) => communication.sendEvent({
        channel: 'hamter:removeTerms',
        promise: true,
        params
      })
    ),
    map((id: number[]) => new TermsRemoveSuccess({id})),
    catchError(() => of(console.log('error')))
  );

  @Effect()
  renameTerm$: Observable<any> = this.actions$.pipe(
    ofType(TermTypes.RenameCompleted),
    map((action: any): any => action.payload),
    switchMap(params => communication.sendEvent({
      channel: 'hamter:renameTerm',
      promise: true,
      params
    })),
    map(params => new TermRenameSuccess(params))
  );
}

