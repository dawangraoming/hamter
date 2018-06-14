/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/4/6
 */

import {environment} from '../environments/environment';

function createCategory() {
  return {
    createdTime: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24),
    id: Math.random().toString(16).substr(2, 14),
    index: -1,
    name: `Test Data ${Math.random().toString(16).substr(2, 4)}`
  };
}

function createArticle() {
  return {
    createdTime: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24),
    id: Math.random().toString(16).substr(2, 14),
    index: -1,
    name: `article-${Math.random().toString(16).substr(2, 4)}`,
    category: {
      id: 0,
    }
  };
}

export function mockInitialState() {
  if (environment.production) {
    return;
  }

  return {
    header: {
      title: 'Hamter'
    },
    categories: {
      list: new Array(32).fill(1).map(createCategory)
    },
    articles: {
      list: new Array(32).fill(1).map(createArticle),
      current: new Array(32).fill(1).map(createArticle)
    }
  };
}
