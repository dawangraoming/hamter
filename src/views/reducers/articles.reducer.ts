/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/8
 */
import {Hamter} from '../../hamter';

import {ArticlesActions, ArticlesTypes} from '../actions';


export interface ArticlesState {
  articles: Hamter.ArticleInterface[];
  loaded: boolean;
}

const initialState: ArticlesState = {
  articles: [],
  loaded: false
};

export function reducer(state: ArticlesState = initialState, action: ArticlesActions) {
  switch (action.type) {
    case ArticlesTypes.ArticlesAddSuccess:
      return {
        ...state,
        articles: [...state.articles, ...action.payload]
      };

    case ArticlesTypes.ArticlesLoadSuccess:
      return {
        ...state,
        articles: [...action.payload]
      };

    case ArticlesTypes.ArticlesRemoveSuccess:
      const idList = [...action.payload];
      return {
        ...state,
        terms: state.articles.filter(item => {
          // 将删除成功的数据，从列表中删除
          for (let index = 0; index < idList.length; index++) {
            if (idList[index] === item.article_id) {
              // 匹配到内容，将其从数组中剔除
              idList.splice(index, 1);
              return false;
            }
          }
          return true;
        })
      };

    default:
      return state;
  }
}

