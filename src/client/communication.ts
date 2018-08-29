/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/6/2
 */


// import {IpcModule} from '../utils/ipc';
import {ipcMain, BrowserWindow, Menu, MenuItem} from 'electron';
import * as dbService from './modules/db-service';
import * as sqlite from 'sqlite';
import {v1 as uuid} from 'uuid';


import {Hamter} from '../hamter';
import {getImageType, getSizeAndTime, convertBase64ToFile, convertPsdToPng} from './modules/image-processing';
import * as Path from 'path';


interface EventParamsInterface {
  callbackId?: string;
  params?: {
    [propName: string]: any;
  };
}

interface AddTermsEventParamsInterface extends EventParamsInterface {
  params: Hamter.AddTermsParams;
}

interface RemoveTermsEventParamsInterface extends EventParamsInterface {
  params: Hamter.RemoveTermsOrArticlesParams;
}

interface AddArticlesEventParamsInterface extends EventParamsInterface {
  params: Hamter.AddArticlesParams;
}

interface GetArticlesEventParamsInterface extends EventParamsInterface {
  params: Hamter.AddTermsParams;
}


class Communication {
  db: sqlite.Database;
  callbackChannelName = 'hamter:_HamterCallbackMethod';
  dbService = dbService.default;

  constructor() {
    this.dbService.open().then(db => this.db = db);
    // 获取原型链上的方法
    const eventMethodList = Object.getOwnPropertyNames((<any>this).__proto__);
    // 自动执行以 Event$ 结尾命名的方法，断言this为any，防止TS报错
    eventMethodList.forEach((name: any) => /Event\$$/.test(name) && (this as any)[name]());
    // this.addGetTermsAndRelationshipsEvent$();
    // this.addTermsEvent$();
    // this.removeTermsEvent$();
    // this.addArticlesEvent$();
    // this.addGetArticlesOfTermEvent$();
    // this.createMenuList();
  }

  createEvent(name: Hamter.IpcType, callback: any) {
    ipcMain.on(name, callback);
  }

  createCallbackEvent(name: Hamter.IpcType, callback: (param: any) => Promise<any>) {
    this.createEvent(name, async (event: Electron.Event, remoteParams: any) => {
      const {callbackId, params} = remoteParams;
      const data = await callback(params);
      event.sender.send(this.callbackChannelName, {
        callbackId,
        data
      });
    });
    // ipcMain.on(name, async (event: Electron.Event, remoteParams: any) => {
    //   const {callbackId, params} = remoteParams;
    //   const data = await callback(params);
    //   event.sender.send(this.callbackChannelName, {
    //     callbackId,
    //     data
    //   });
    // });
  }

  getTermsAndRelationshipsEvent$() {
    ipcMain.on('hamter:getTermsAndRelationships', async (event: Electron.Event, remoteParams: EventParamsInterface) => {
      const callbackId = remoteParams.callbackId;
      // 从数据库从取出关系与分类
      const data = await Promise.all([this.dbService.getTerms(), this.dbService.getRelationships()]);
      const termsAndRelationships = {
        terms: data[0],
        relationships: data[1]
      };
      if (callbackId) {
        event.sender.send(this.callbackChannelName, {
          callbackId,
          data: termsAndRelationships
        });
      }
    });
  }

  getArticlesOfTermEvent$() {
    this.createCallbackEvent('hamter:getArticlesOfTerm', async (params: Hamter.GetArticlesOfTermParams) => {
      return await this.dbService.getArticlesOfTerm(params);
    });
  }

  addTermsEvent$() {
    ipcMain.on('hamter:addTerms', async (event: Electron.Event, remoteParams: AddTermsEventParamsInterface) => {
      const {callbackId, params} = remoteParams;
      let names = params.names;
      if (!Array.isArray(names)) {
        names = [names];
      }
      const data = await this.dbService.addTerms({
        names,
        type: params.type
      });
      if (callbackId) {
        event.sender.send(this.callbackChannelName, {
          callbackId,
          data
        });
      }
    });
  }

  removeTermsEvent$() {
    this.createCallbackEvent('hamter:removeTerms', async (params: Hamter.RemoveTermsOrArticlesParams) => {
      return await this.dbService.removeTerms(params);
    });
  }

  renameTermEvent$() {
    this.createCallbackEvent('hamter:renameTerm', async (params: Hamter.RenameTermParams) => {
      return await this.dbService.renameTerm(params);
    });
  }

  addArticlesEvent$() {
    this.createCallbackEvent('hamter:addArticles', async (params: Hamter.AddArticlesParams) => {
      const articles = [];
      for (const item of params.articles) {
        const {path, name, remotePath} = item;
        // get image's type and mime
        const imageType = await getImageType(path);
        // generate a image file if file not a image which is like psd
        let distPath;
        if (imageType.ext === 'psd') {
          const fileName = uuid() + '.png';
          // get store path from database
          const storePath = await this.dbService.getOption('storePath');
          distPath = Path.join(storePath, fileName);
          // generate a image from psd file
          await convertPsdToPng(path, distPath);
        }
        // get image's size and width
        const imageData = await getSizeAndTime(path);
        articles.push({
          article_name: name,
          article_local_path: distPath ? distPath : path,
          article_source_file_path: path,
          article_thumb_path: null,
          article_remote_path: remotePath ? remotePath : null,
          article_width: null,
          article_height: null,
          article_size: imageData.size,
          article_type: imageType.ext,
          article_mime: imageType.mime,
          article_created_time: imageData.birthTime,
        });
      }
      return await this.dbService.addArticles({
        categoryId: params.categoryId > 1 ? params.categoryId : 2, // 如果选择了全部列表，则计入未分组
        articles
      });
    });
  }

  removeArticlesEvent$() {
    this.createCallbackEvent('hamter:removeArticles', async (params: Hamter.RemoveArticlesParams) => {
      const result = await this.dbService.removeArticles(params);
      return Array.isArray(result) ? result : [result];
    });
  }


  initArticleEvent$() {
    this.createCallbackEvent('hamter:initArticle', async (params: Hamter.UpdateArticleWidthHeightAndThumbParams) => {
      const fileName = uuid() + '.webp';
      // get store path from database
      let storePath = await this.dbService.getOption('storePath');
      storePath = Path.join(storePath, fileName);
      // generate thumbnail image on back
      convertBase64ToFile(params.image, storePath).catch(err => {
        throw err;
      });
      // update and then return a updated data
      return await this.dbService.updateArticle(params.id, {
        article_thumb_path: storePath,
        article_width: params.width,
        article_height: params.height
      });
    });
  }
}

export default new Communication();

