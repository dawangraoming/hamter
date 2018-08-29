/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/4
 */

import {TermsActions, TermTypes} from '../actions';
import {Hamter} from '../../hamter';
import TermInterface = Hamter.TermInterface;

export interface TermsState {
  terms: TermInterface[];
  loaded: boolean;
  renameId: number;
  selectedId: number;
}

const initialState: TermsState = {
  terms: [],
  loaded: false,
  renameId: 0,
  selectedId: 0
};

export function reducer(state: TermsState = initialState, action: TermsActions) {
  switch (action.type) {

    case TermTypes.AddSuccess:
      return {
        ...state,
        terms: [...state.terms, ...action.payload]
      };

    case TermTypes.LoadSuccess:
      return {
        ...state,
        terms: [...action.payload]
      };

    case TermTypes.RemoveSuccess:
      const idList = [...action.payload.id];
      return {
        ...state,
        terms: state.terms.filter(item => {
          // 将删除成功的数据，从列表中删除
          for (let index = 0; index < idList.length; index++) {
            if (idList[index] === item.term_id) {
              // 匹配到内容，将其从数组中剔除
              idList.splice(index, 1);
              return false;
            }
          }
          return true;
        })
      };

    case TermTypes.Rename:
      return {
        ...state,
        renameId: action.payload.id,
      };

    case TermTypes.RenameCompleted:
      return {
        ...state,
        renameId: 0,
      };

    case TermTypes.RenameSuccess:
      const terms = state.terms.map(item => {
        const {term_name, term_id} = action.payload;
        if (item.term_id === term_id) {
          return {
            ...item,
            term_name: term_name
          };
        } else {
          return item;
        }
      });
      return {
        ...state,
        terms
      };

    case TermTypes.TermSelect:
      return {
        ...state,
        selectedId: action.payload
      };

    case TermTypes.TermsReset:
      return initialState;

    default :
      return state;
  }
}
