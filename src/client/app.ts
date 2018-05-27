/*!
 * @author dawangraoming<admin@yeenuo.net>
 * @date 2018/3/21
 */

import {BrowserWindow, app} from 'electron';
import {IS_DEV} from '../utils/env-check';
import {join} from 'path';


let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    maxWidth: 800,
    maxHeight: 600,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    titleBarStyle: 'hidden'
  });

  mainWindow.loadURL(IS_DEV ? 'http://localhost:4200' : join(__dirname, '../views', 'index.html'));


  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
