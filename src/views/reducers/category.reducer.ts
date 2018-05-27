/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/4
 */

import {CategoryInterface, CategoryActions, CategoryTypes} from '../actions';

export interface CategoriesState {
  list: CategoryInterface[];
}

const initialState: CategoriesState = {
  list: []
};

export function reducer(state: CategoriesState = initialState, action: CategoryActions) {
  switch (action.type) {
    case CategoryTypes.CategoryAdd:
      return {
        ...state,
        list: [...state.list, ...action.payload]
      };

    case CategoryTypes.CategoryRemove:
      const data = [...state.list];
      data.slice(action.payload.id, 1);
      return {
        ...state,
        list: data
      };

    case CategoryTypes.CategoryReset:
      return initialState;

    default :
      return state;
  }
}
