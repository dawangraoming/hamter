/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/27
 */


import {ipcMain} from 'electron';
import {Hamter} from '../hamter';

class Communication {

  private _eventList: Hamter.CommunicationEventSet;

  constructor(private _render: Electron.BrowserWindow) {

  }

  private _send(channel: string, arg: any) {

  }

  setRender(render: Electron.BrowserWindow) {
    this._render = render;
  }

  addEvent(params: Hamter.CommunicationClientInterface) {
    ipcMain.on(params.channel, params.callback);
  }

  sendEvent(params: Hamter.CommunicationRenderInterface) {
    if (this._render) {
      this._render.webContents.send(params.channel, params.params);
    }
  }
}

export default new Communication(null);


