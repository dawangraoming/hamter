/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/4
 */

import {Action} from '@ngrx/store';
import {Hamter} from '../../hamter';
import AddTermsParams = Hamter.AddTermsParams;
import TermInterface = Hamter.TermInterface;


export enum TermTypes {
  Load = '[Terms] Load',
  LoadSuccess = '[Terms] Load Success',
  Remove = '[Terms] Remove',
  RemoveSuccess = '[Terms] Remove Success',
  Add = '[Terms] Add',
  AddSuccess = '[Terms] Add Success',
  TermsReset = '[Terms] Reset',
  TermsResetSuccess = '[Terms] Reset Success',
}


export class TermsLoad implements Action {
  readonly type = TermTypes.Load;
}

export class TermsLoadSuccess implements Action {
  readonly type = TermTypes.LoadSuccess;

  constructor(public payload: TermInterface[]) {

  }
}

export class TermsAdd implements Action {
  readonly type = TermTypes.Add;

  constructor(public payload: AddTermsParams) {
  }
}

export class TermsAddSuccess implements Action {
  readonly type = TermTypes.AddSuccess;

  constructor(public payload: TermInterface[]) {
  }
}

interface TermRemoveInterface {
  id: number[];
}

export class TermsRemove implements Action {
  readonly type = TermTypes.Remove;

  constructor(public payload: TermRemoveInterface) {
  }
}

export class TermsRemoveSuccess implements Action {
  readonly type = TermTypes.RemoveSuccess;

  constructor(public payload: TermRemoveInterface) {
  }
}

export class ResetTermsAction implements Action {
  readonly type = TermTypes.TermsReset;
}

export type TermsActions = TermsAdd
  | TermsAddSuccess
  | TermsLoad
  | TermsLoadSuccess
  | TermsRemove
  | TermsRemoveSuccess
  | ResetTermsAction;


