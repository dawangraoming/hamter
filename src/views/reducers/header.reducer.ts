/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/3
 */

import * as actions from '../actions';

export interface HeaderState {
  title: string;
}

const initialState: HeaderState = {
  title: 'Hamter'
};

export const reducer = (state: HeaderState = initialState, action: actions.HeaderActions) => {
  switch (action.type) {
    case actions.HeaderTitleTypes.SetHeaderTitle:
      return Object.assign(state, {title: action.payload});

    default :
      return state;
  }
};


