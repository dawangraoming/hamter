/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/27
 */


import {ipcMain} from 'electron';
import {Hamter} from '../../hamter';
import CommunicationIpcObject = Hamter.CommunicationIpcObject;
import CommunicationSendMethod = Hamter.CommunicationSendMethod;


export class IpcModule {

  private _eventList: Hamter.CommunicationEventSet;

  constructor(private _ipcObject: CommunicationIpcObject,
              private _sendMethod?: CommunicationSendMethod) {
    // 添加一个回调事件监听
    this.addEvent({
      channel: 'hamter:_HamterCallbackMethod',
      callback: (event, params) => {
        const id = params.callbackId;
        if (this._eventList[id] && typeof id === 'function') {
          this._eventList[id](event, params);
          delete this._eventList[id];
        }
      }
    });
  }

  setIpcObject(ipcObject: CommunicationIpcObject) {
    this._ipcObject = ipcObject;
  }

  setSendMethod(fn: CommunicationSendMethod) {
    this._sendMethod = fn;
  }

  addEvent(params: Hamter.CommunicationClientInterface) {
    ipcMain.on(params.channel, () => {
      params.callback(...arguments, (data: any) => {
        const callbackId = params.callbackId;
        this.sendEvent({
          channel: 'hamter:_HamterCallbackMethod',
          data,
          callbackId: callbackId
        });
      });
    });
  }

  sendEvent(params: Hamter.CommunicationRenderInterface) {
    // 判断是否有回调
    const callback = params.callback;
    if (callback) {
      // 如果拥有回调，则添加到事件队列中，等完成后调用
      // 生成一个callbackId
      const callbackId = params.callbackId = Math.random().toString(16).substr(2);

      // 如果不存在事件，则添加一次
      if (!this._eventList.hasOwnProperty(callbackId)) {
        this._eventList[callbackId] = callback;
      }
      if (this._sendMethod) {
        // 如果存在自定义的send方法，则使用自定义的发送
        this._sendMethod(params.channel, params.params);
      } else {
        // 断言ipcObject属于IpcRender，否则会出现报错
        (<Electron.IpcRenderer>this._ipcObject).send(params.channel, params.params);
      }
    }
  }
}
