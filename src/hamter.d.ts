/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/26
 */
///<reference path="../node_modules/electron/electron.d.ts"/>

declare global {
  interface CanvasRenderingContext2D {
    imageSmoothingQuality: 'high';
  }
}

export declare namespace Hamter {

  type HamterAsyncCallbackMethod = 'hamter:_HamterCallbackMethod';
  // 获取分类与关系
  type GetTermsAndRelationships = 'hamter:getTermsAndRelationships';
  // 获取指定分类的内容
  type GetArticlesOfTerm = 'hamter:getArticlesOfTerm';

  // 添加分类
  type AddTerms = 'hamter:addTerms';
  // 删除分类
  type RemoveTerms = 'hamter:removeTerms';
  // 添加内容
  type AddArticles = 'hamter:addArticles';
  // rename a term
  type RenameTerm = 'hamter:renameTerm';
  type InitArticle = 'hamter:initArticle';

  type IpcType = HamterAsyncCallbackMethod
    | GetTermsAndRelationships
    | GetArticlesOfTerm
    | AddTerms
    | RemoveTerms
    | AddArticles
    | RenameTerm
    | InitArticle ;

  type TermType = 'category' | 'tag';


  interface CommunicationParamsInterface {
    callbackId?: string;
    data?: {
      [propName: string]: any;
    };

    [propName: string]: any;
  }

  type CallbackParams = (event: Electron.Event, data: any) => any;


  interface EventListInterface {
    [id: string]: CallbackParams;
  }

  interface AddAndSendParamsInterface {
    channel: IpcType;
    params?: CommunicationParamsInterface;
    callback?: CallbackParams;
    callbackId?: string;
    promise?: boolean;
  }

  interface GetArticlesOfTermParams {
    termID: number;
    limit?: number;
  }

  interface AddTermsParams {
    type: TermType;
    names: string[];
  }

  interface RemoveTermsOrArticlesParams {
    id: number[];
  }

  interface ArticlesBaseParams {
    name: string;
    path: string;
    remotePath?: string;
  }

  interface AddArticleToDatabaseParams {
    article: ArticleInputDataInterface;
    categoryId?: number;
  }

  interface AddArticlesToDatabaseParams {
    articles: ArticleInputDataInterface[];
    categoryId?: number;
  }

  interface AddArticleParams {
    article: ArticlesBaseParams;
    categoryId: number;
  }

  interface AddArticlesParams {
    articles: ArticlesBaseParams[];
    categoryId?: number;
  }

  interface AddArticlesCallbackParams {
    articles: ArticleInterface[];
    relationships: RelationshipsInterface[];
    terms: TermInterface[];
  }

  interface UpdateArticleWidthHeightAndThumbParams {
    image: string;
    id: number;
    width: number;
    height: number;
  }

  interface RemoveArticlesParams {
    articleId: number[] | number;
  }

  interface RenameTermParams {
    term_id: number;
    term_name: string;
  }

  interface TermInterface {
    term_id: number;
    term_name: string;
    term_type: string;
    term_order: number;
    term_parent: number;
    term_count: number;
    onRename: boolean;
  }

  interface ArticleInputDataInterface {
    article_name: string;
    article_local_path: string;
    article_thumb_path: string;
    article_remote_path: string;
    article_width: number;
    article_height: number;
    article_size: number;
    article_type: string;
    article_mime: string;
    article_created_time: number;
  }

  type ArticleAttr = 'article_name'
    | 'article_local_path'
    | 'article_thumb_path'
    | 'article_remote_path'
    | 'article_width'
    | 'article_height'
    | 'article_size'
    | 'article_type'
    | 'article_mime'
    | 'article_created_time';

  export type ArticleUpdate = {[P in ArticleAttr]?: any};

  interface ArticleInterface extends ArticleInputDataInterface {
    article_id: number;
    article_added_time: number;
  }

  interface RelationshipsInterface {
    term_id: number;
    article_id: number;
  }

  interface GetTermsAndRelationshipsParams {
    terms: TermInterface[];
    relationships: RelationshipsInterface[];
  }

  interface GetTermsAndRelationshipsParamsPayload {
    payload: GetTermsAndRelationshipsParams;
  }


}
