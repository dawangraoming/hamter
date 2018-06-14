/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/6/2
 */


import {Hamter} from '../../hamter';

type HamterAsyncCallbackMethod = 'hamter:_HamterCallbackMethod';
// 获取分类与关系
type GetTermsAndRelationships = 'hamter:getTermsAndRelationships';
// 添加分类
type AddTerms = 'hamter:addTerms';

type IpcType = HamterAsyncCallbackMethod | GetTermsAndRelationships | AddTerms;




class Communication {
  private _eventList: Hamter.EventListInterface = {};
  private ipcRenderer: Electron.IpcRenderer;

  constructor() {
    this.ipcRenderer = (<any>window).require('electron').ipcRenderer;

    // 添加一个回调事件监听
    this.addEvent({
      channel: 'hamter:_HamterCallbackMethod',
      callback: (event, params) => {
        const id = params.callbackId;
        const cb = this._eventList[id];
        if (cb && typeof cb === 'function') {
          cb(event, params.data);
          delete this._eventList[id];
        }
      }
    });
  }

  addEvent(params: Hamter.AddAndSendParamsInterface) {
    this.ipcRenderer.on(params.channel, params.callback);
  }


  sendEvent(sendParams: Hamter.AddAndSendParamsInterface): Promise<any> | null {
    let callbackId = '';

    if (sendParams.promise || sendParams.callback) {
      // 生成一个callbackId
      callbackId = Math.random().toString(16).substr(2);
      // 将params数据组装成{ callbackId: xx, params: {} }这种类型
      sendParams.params = Object.assign({}, {params: sendParams.params}, {callbackId});
    }
    // promise方式
    if (sendParams.promise) {
      return new Promise((resolve, reject) => {

        function cb(e, d) {
          resolve(d);
        }

        // 如果不存在事件，则添加一次
        if (!this._eventList.hasOwnProperty(callbackId)) {
          this._eventList[callbackId] = cb;
        }
        this.ipcRenderer.send(sendParams.channel, sendParams.params);
      });
    }
    // 判断是否有回调
    const callback = sendParams.callback;
    if (callback) {
      // 如果拥有回调，则添加到事件队列中，等完成后调用
      sendParams.params = Object.assign({}, sendParams.params, {callbackId});

      // 如果不存在事件，则添加一次
      if (!this._eventList.hasOwnProperty(callbackId)) {
        this._eventList[callbackId] = callback;
      }
    }
    this.ipcRenderer.send(sendParams.channel, sendParams.params);
  }
}

export default new Communication();
