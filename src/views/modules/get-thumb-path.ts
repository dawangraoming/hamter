/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/8/1
 */


import {Hamter} from '../../hamter';

/**
 * get thumb path, if thumb doesn't exist return to local path;
 * @param {Hamter.ArticleInterface} article
 * @return {string}
 */
export function getThumbPath(article: Hamter.ArticleInterface) {
  return 'file://' + (article.article_thumb_path ? article.article_thumb_path : article.article_local_path);
}
