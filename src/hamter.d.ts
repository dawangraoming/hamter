/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/26
 */
///<reference path="../node_modules/electron/electron.d.ts"/>

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
  type AddArrticles = 'hamter:addArticles';


  type IpcType = HamterAsyncCallbackMethod
    | GetTermsAndRelationships
    | GetArticlesOfTerm
    | AddTerms
    | RemoveTerms
    | AddArrticles;

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

  interface ArticlesParams {
    article_name: string;
    article_local_path: string;
    article_remote_path: string;
  }

  interface AddArticlesParams {
    articles: ArticlesParams[];
    categoryId?: number;
  }

  interface AddArticlesCallbackParams {
    articles: ArticleInterface[];
    relationships: RelationshipsInterface[];
    terms: TermInterface[];
  }

  interface RemoveArticlesParams {
    articleId: number[] | number;
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

  interface ArticleInterface {
    article_id: number;
    article_name: string;
    article_local_path: string;
    article_remote_path: string;
    article_create_time: number;
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
