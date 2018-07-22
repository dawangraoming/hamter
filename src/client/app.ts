/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/21
 */

import {BrowserWindow, app} from 'electron';
import {IS_DEV} from './modules/env-check';
import {join} from 'path';
import './communication';
import dbService from './modules/db-service';

let mainWindow: BrowserWindow;
// 判断是否退出行为的变量
let mainWindowQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // maxWidth: 800,
    // maxHeight: 600,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false,
      minimumFontSize: 9
    }
  });

  // console.log(app.getPath('userData'));
  if (IS_DEV) {
    BrowserWindow.addDevToolsExtension(
      '~/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.15.3_0');
  }

  // mainWindow.loadURL(IS_DEV ? 'http://localhost:4200' : join(__dirname, '../views', 'index.html'));
  mainWindow.loadURL('http://localhost:4200');

  mainWindow.on('close', function (e) {
    if (mainWindowQuitting) {
      mainWindow = null;
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });
  // mainWindow.on('closed', function () {
  //   communication.setRender(mainWindow);
  //   console.log('on closed');
  // });

  // communication.setSendMethod(mainWindow.webContents.send);
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', function () {
  mainWindowQuitting = true;
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
  mainWindow.show();
});
