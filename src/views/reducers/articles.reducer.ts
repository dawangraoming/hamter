/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/8
 */
import {ArticleInterface, ArticlesActions, ArticlesTypes} from '../actions';


export interface ArticlesState {
  list: ArticleInterface[];
}

const initialState: ArticlesState = {
  list: [],
};

export function reducer(state: ArticlesState = initialState, action: ArticlesActions) {
  switch (action.type) {
    case ArticlesTypes.ArticlesAdd:
      return Object.assign({}, state, {list: [...state.list, ...action.payload]});

    case ArticlesTypes.ArticlesRemove:
      const data = [...state.list];
      data.slice(action.payload.id, 1);
      return Object.assign({}, state, {list: data});

    case ArticlesTypes.ArticlesReset:
      return initialState;

    default:
      return state;
  }
}

