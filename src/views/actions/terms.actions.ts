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
  Rename = '[Terms] Rename',
  RenameCompleted = '[Terms] Rename Completed',
  RenameSuccess = '[Terms] Rename Success',
  TermsReset = '[Terms] Reset',
  TermsResetSuccess = '[Terms] Reset Success',
}

// load data from the database
export class TermsLoad implements Action {
  readonly type = TermTypes.Load;
}

// load data success
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

interface TermRenameInterface {
  id: number;
}

export class TermRename implements Action {
  readonly type = TermTypes.Rename;

  constructor(public payload: TermRenameInterface) {
  }
}

export class TermRenameCompleted implements Action {
  readonly type = TermTypes.RenameCompleted;

  constructor(public payload: Hamter.RenameTermParams) {
  }
}

export class TermRenameSuccess implements Action {
  readonly type = TermTypes.RenameSuccess;

  constructor(public payload: Hamter.RenameTermParams) {

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
  | TermRename
  | TermRenameCompleted
  | TermRenameSuccess
  | ResetTermsAction;


