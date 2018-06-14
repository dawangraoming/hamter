/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/5/23
 */

import * as sqlite from 'sqlite';
import {join} from 'path';
import {Hamter} from '../../../hamter';


class DBService {
  db: sqlite.Database;

  constructor() {

  }

  /**
   * 将sql参数转为根据数组转为多个问号
   * 目前node-sqlite3还不支持数组转IN，所以需要转化
   * @param {string} sql
   * @param {any[]} arr
   * @return {string}
   */
  sqlArrayParams(sql: string, arr: any[]) {
    return sql.replace('?#', arr.map(() => '?').join(','));
  }

  open() {
    return sqlite.open('./hamter.db').then(db => {
      this.db = db;
      return db.migrate({migrationsPath: join(__dirname, '../../', '/assets/migrations/')});
    });
  }

  /**
   * 获取分类
   * @return {Promise<any>}
   */
  getTerms() {
    return this.db.all(`SELECT * FROM terms;`);
  }

  /**
   * 获取关系的数据
   * @return {Promise<any>}
   */
  getRelationships() {
    return this.db.all(`SELECT * FROM terms_relationships`);
  }

  getArticlesOfTerm(params: Hamter.GetArticlesOfTermParams): Promise<Hamter.ArticleInterface[]> {
    let sql = `SELECT * FROM articles WHERE article_id IN (SELECT article_id FROM terms_relationships WHERE term_id = ?)`;
    // 如果存在limit，则限定取出的数量
    if (params.limit) {
      sql += ` LIMIT ${params.limit}`;
    }
    return this.db.all(sql, params.termID);
  }

  /**
   * 添加分类
   * @param {AddTermsParams} params
   * @return {Promise<number[]>} 添加的分类ID
   */
  async addTerms(params: Hamter.AddTermsParams): Promise<number[]> {
    const resultId = [];
    for (const name of params.names) {
      const {lastID} = await this.db.run(`INSERT INTO terms (term_type, term_name) VALUES (?, ?)`, params.type, name);
      resultId.push(lastID);
    }
    const getResultSql = this.sqlArrayParams(`SELECT * FROM terms WHERE term_id IN (?#)`, resultId);
    return await this.db.all(getResultSql, resultId);
  }

  /**
   * 删除分类
   * @param {Hamter.RemoveTermsOrArticlesParams} params
   * @return {Promise<number[]>}
   */
  async removeTerms(params: Hamter.RemoveTermsOrArticlesParams) {
    const id = params.id;
    // 从关系表中将这些分组中的内容给迁移到未分类
    const removeRelationships = this.sqlArrayParams(`UPDATE terms_relationships SET term_id = 1 WHERE term_id IN (?#)`, id);
    await this.db.run(removeRelationships, id);
    // 删除分组
    const removeTermsSql = this.sqlArrayParams(`DELETE FROM terms WHERE term_id IN (?#)`, id);
    await this.db.run(removeTermsSql, id);
    return id;
  }

  async addArticles(params: Hamter.AddArticlesParams): Promise<Hamter.AddArticlesCallbackParams> {
    const resultId = [];
    // 如果不选择目录，则设置为无目录
    const categoryId = params.categoryId && Number.isInteger(params.categoryId) ? params.categoryId : 1;
    for (const item of params.articles) {
      const {lastID} = await this.db.run(`INSERT INTO articles (article_name, article_local_path, article_remote_path) VALUES (?,?,?)`,
        item.article_name, item.article_local_path, item.article_remote_path);
      this.db.run(`INSERT INTO terms_relationships (article_id, term_id) VALUES (?, ?)`, lastID, categoryId);
      resultId.push(lastID);
    }
    // 获取插入内容的信息
    const getResultSql = this.sqlArrayParams(`SELECT * FROM articles WHERE article_id IN (?#)`, resultId);
    const articles = await this.db.all(getResultSql, resultId);
    // 获取分类
    const terms = await this.getTerms();
    // 获取变更的关系数据
    const relationships = resultId.map(id => {
      return {
        article_id: id,
        term_id: categoryId
      };
    });
    return {
      articles,
      relationships,
      terms
    };
  }


  removeArticles(params: Hamter.RemoveArticlesParams) {
    const id = params.articleId;
    // 如果是数组，组装成出promise数组，使用promise.all返回
    if (Array.isArray(id)) {
      const promiseList = [];
      for (const articleId of id) {
        promiseList.push(this.removeArticles.bind(this, {articleId}));
      }
      return Promise.all(promiseList);
    } else {
      return this.db.run(`DELETE FROM terms_relationships WHERE article_id = ?;
      DELETE FROM articles WHERE article_id = ?`, id, id);
    }
  }

}

const dbService = new DBService();
export default dbService;
