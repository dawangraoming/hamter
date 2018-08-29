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

  sqlObjectParamsFormat(data: { [propName: string]: any }): { columns: string[], valueMarks: string[], values: string[] } {
    const columns = [];
    const values = [];
    const marks = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        columns.push(key);
        marks.push('?');
        values.push(data[key]);
      }
    }
    return {
      columns: columns,
      valueMarks: marks,
      values: values
    };
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

  /**
   * get articles from terms, if params.termId is 0 then get all articles
   * @param {Hamter.GetArticlesOfTermParams} params
   * @return {Promise<Hamter.ArticleInterface[]>}
   */
  getArticlesOfTerm(params: Hamter.GetArticlesOfTermParams): Promise<Hamter.ArticleInterface[]> {
    let sql = params.termID > 0 ?
      `SELECT * FROM articles WHERE article_id IN (SELECT article_id FROM terms_relationships WHERE term_id = ?)` :
      `SELECT * FROM articles`;
    // 如果存在limit，则限定取出的数量
    if (params.limit) {
      sql += ` LIMIT ${params.limit}`;
    }
    return this.db.all(sql, params.termID);
  }

  getArticleDetails(id: number) {
    return this.db.get('SELECT * FROM articles WHERE article_id = ?', id);
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

  /**
   * add an article to database
   * @param {Hamter.AddArticleParams} params
   * @return {Promise<number>}
   */
  async addArticle(params: Hamter.AddArticleToDatabaseParams): Promise<number> {
    const formatSql = this.sqlObjectParamsFormat(params.article);
    // insert data to database
    const {lastID} = await this.db.run(
      `INSERT INTO articles (${formatSql.columns.join(', ')}) VALUES (${formatSql.valueMarks.join(', ')})`,
      formatSql.values);
    // insert id which has been inserted to relationship table
    this.db.run(`INSERT INTO terms_relationships (article_id, term_id) VALUES (${lastID}, ${params.categoryId});`).catch(err => console.error(err));
    this.db.run(`INSERT INTO terms_relationships (article_id, term_id) VALUES (${lastID}, 1)`).catch(err => console.error(err));
    return lastID;
  }


  async updateArticle(id: number, data: Hamter.ArticleUpdate) {
    const {columns, values} = this.sqlObjectParamsFormat(data);
    let sqlStr = '', i = 0;
    for (i; i < columns.length; i++) {
      sqlStr += `${columns[i]} = ?`;
      if (i < columns.length - 1) {
        sqlStr += ',';
      }
    }
    await this.db.run(`UPDATE articles SET ${sqlStr} WHERE article_id = ?`, [...values, id]);
    return this.getArticleDetails(id);
  }

  async addArticles(params: Hamter.AddArticlesToDatabaseParams): Promise<Hamter.AddArticlesCallbackParams> {
    const resultId = [];
    // 如果不选择目录，则设置为无目录
    const categoryId = params.categoryId && Number.isInteger(params.categoryId) ? params.categoryId : 1;
    for (const item of params.articles) {
      const lastID = await this.addArticle({categoryId, article: item});
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


  removeArticles(params: Hamter.RemoveArticlesParams): Promise<number[] | number> {
    const id = params.articleId;
    const sql = `DELETE FROM terms_relationships WHERE article_id IN (${id.join(',')});`
      + `DELETE FROM articles WHERE article_id IN (${id.join(',')});`;
    return this.db.run(sql).then(() => id);
  }

  async renameTerm(params: Hamter.RenameTermParams) {
    await this.db.run(`UPDATE terms SET term_name = ? WHERE term_id = ?`, params.term_name, params.term_id);
    return params;
  }

  /**
   * set one option of options table
   * @param {string} key
   * @param {string} value
   * @return {Promise<any>}
   */
  setOption(key: string, value: string) {
    return this.db.get('REPLACE INTO options VALUES (? , ?)', [key, value]);
  }

  /**
   * get one option of options table
   * @param {string} key
   * @return {Promise<string>}
   */
  getOption(key: string): Promise<string> {
    return this.db.get('SELECT * FROM options WHERE option_name = ?', key).then(value => value ? value.option_value : '');
  }

  /**
   * get all options of options table
   * @return {Promise<any>}
   */
  getAllOptions() {
    return this.db.get('SELECT * FROM options');
  }

}

const dbService = new DBService();
export default dbService;
