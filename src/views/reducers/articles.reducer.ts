/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/8
 */
import {Hamter} from '../../hamter';

import {ArticlesActions, ArticlesTypes} from '../actions';


export interface ArticlesState {
  articles: Hamter.ArticleInterface[];
  articlesSelect: Hamter.ArticleInterface[];
  loaded: boolean;
}

const initialState: ArticlesState = {
  articles: [],
  articlesSelect: [],
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
        articles: state.articles.filter(item => {
          // 将删除成功的数据，从列表中删除
          for (let index = (idList.length - 1); index > -1; index--) {
            if (idList[index] === item.article_id) {
              // 匹配到内容，将其从数组中剔除
              idList.splice(index, 1);
              return false;
            }
          }
          return true;
        })
      };

    case ArticlesTypes.ArticlesUpdate:
      const list = [...action.payload];
      const articles = state.articles.map(oldItem => {
        // 将新数据循环匹配旧数据，当遇到ID相同时，进行合并操作
        for (let i = (list.length - 1); i > -1; i--) {
          const newItem = list[i];
          if (oldItem.article_id === newItem.article_id) {
            // 将新数据覆盖旧数据，并从循环队列中删除，下次不再匹配
            return list.splice(i, 1)[0];
          }
        }
        return oldItem;
      });
      return {
        ...state,
        articles
      };

    case ArticlesTypes.ArticlesSelect:
      const articleIdList = [...action.payload];
      return {
        ...state,
        articles: state.articles.map(item => {
          for (let i = (articleIdList.length - 1); i > -1; i--) {
            if (item.article_id === articleIdList[i].article_id) {
              articleIdList.splice(i, 1);
              return {
                ...item,
                selected: true
              };
            }
          }
          return {
            ...item,
            selected: false
          };
        }),
        articlesSelect: [...action.payload]
      };

    case ArticlesTypes.ArticlesSelectReset:
      return {
        ...state,
        articles: state.articles.map(item => {
          return {...item, selected: false};
        }),
        articlesSelect: []
      };

    default:
      return state;
  }
}

