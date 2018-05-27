/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/3
 */

import {Action} from '@ngrx/store';


export enum HeaderTitleTypes {
  HeaderTitle = '[Header] Title',
  SetHeaderTitle = '[Header] Set Title',
}

export class SetHeaderTitleAction implements Action {
  readonly type = HeaderTitleTypes.SetHeaderTitle;

  constructor(public payload: string) {
  }
}

export type HeaderActions = SetHeaderTitleAction;
