/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/5/23
 */

import * as sqlite from 'sqlite';
import {join} from 'path';

type TermType = 'category' | 'tag';

interface GetArticlesOfTermParams {
  termID: number;
  count?: number;
}

interface AddTermsParams {
  type: TermType;
  names: string[];
}

interface ArticleInterface {
  categoryId?: number;
  localPath: string;
  remotePath?: string;
  name: string;
}

interface AddArticlesParams {
  articles: ArticleInterface[];
  categoryId?: number;
}

interface RemoveArticlesParams {
  articleId: number[] | number;
}

class DBService {
  db: sqlite.Database;

  constructor() {

  }

  open() {
    return sqlite.open('./hamter.db').then(db => {
      this.db = db;
      return db.migrate({migrationsPath: join(__dirname, '../../../', 'src/client/db-service/migrations/')});
    });
  }

  getArticlesOfTerm(params: GetArticlesOfTermParams): Promise<any> {
    let sql = `SELECT * FROM articles WHERE article_id IN (SELECT article_id FROM terms_relationships WHERE term_id = ?)`;
    // 如果存在count，则限定取出的数量
    if (params.count) {
      sql += ` LIMIT ${params.count}`;
    }
    return this.db.get(sql, params.termID);
  }

  addTerms(params: AddTermsParams): Promise<void> {
    return this.db.prepare(`INSERT INTO terms (term_type, term_name) VALUES (?, ?)`).then(stmt => {
      for (const name of params.names) {
        stmt.run(params.type, name);
      }
      return stmt.finalize();
    });
  }

  async addArticles(params: AddArticlesParams) {
    const resultId = [];
    // 如果不选择目录，则设置为无目录
    const categoryId = params.categoryId && Number.isInteger(params.categoryId) ? params.categoryId : 1;
    for (const item of params.articles) {
      const {lastID} = await this.db.run(`INSERT INTO articles (article_name, article_local_path, article_remote_path) VALUES (?,?,?)`,
        item.name, item.localPath, item.remotePath);
      this.db.run(`INSERT INTO terms_relationships (article_id, term_id) VALUES (?, ?)`, lastID, categoryId);
      resultId.push(lastID);
    }
    return resultId;
  }

  removeArticles(params: RemoveArticlesParams) {
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
