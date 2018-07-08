/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/6/2
 */


// import {IpcModule} from '../utils/ipc';
import {ipcMain, BrowserWindow, Menu, MenuItem} from 'electron';
import * as dbService from './modules/db-service';
import * as sqlite from 'sqlite';


import {Hamter} from '../hamter';


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
  menuList: any = {
    contextMenuOfTerm: null
  };

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
    this.createMenuList();
  }

  createMenuList() {
    const menu = new Menu();
    menu.append(new MenuItem({
      label: '新建',
      click() {

      }
    }));
    menu.append(new MenuItem({
      label: '重命名',
      click() {
        console.log('time');
      }
    }));
    menu.append(new MenuItem({
      label: '删除',
      click() {

      }
    }));
    this.menuList['contextMenuOfTerm'] = menu;
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

  addGetTermsAndRelationshipsEvent$() {
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

  addGetArticlesOfTermEvent$() {
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
    // ipcMain.on('hamter:removeTerms', async (event: Electron.Event, remoteParams: RemoveTermsEventParamsInterface) => {
    //   const {callbackId, params} = remoteParams;
    //   const data = await this.dbService.removeTerms(params);
    //   event.sender.send(this.callbackChannelName, {
    //     callbackId,
    //     data
    //   });
    // });
  }

  addArticlesEvent$() {
    this.createCallbackEvent('hamter:addArticles', async (params: Hamter.AddArticlesParams) => {
      return await this.dbService.addArticles(params);
    });
    // ipcMain.on('hamter:addArticles', async (event: Electron.Event, remoteParams: AddArticlesEventParamsInterface) => {
    //   const {callbackId, params} = remoteParams;
    //   const data = await this.dbService.addArticles(params);
    //   event.sender.send(this.callbackChannelName, {
    //     callbackId,
    //     data
    //   });
    // });
  }

  renameTermEvent$() {
    this.createCallbackEvent('hamter:renameTerm', async (params: Hamter.RenameTermParams) => {
      return await this.dbService.renameTerm(params);
    });
  }
}

export default new Communication();

