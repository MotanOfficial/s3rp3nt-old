import path from 'path';
import { app, ipcMain, BrowserWindow, shell } from 'electron';
import serve from 'electron-serve';
import { startUpdater } from './updater';
import { createWindow } from './helpers';
import './version'; // Import the version script

const isProd = process.env.NODE_ENV === 'production';

// Serve app
if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

global.updaterWindow = null;
let mainWindow;

function createUpdaterWindow() {
  if (global.updaterWindow) {
    global.updaterWindow.close();
  }
  
  global.updaterWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
    backgroundColor: '#000',
  });

  global.updaterWindow.loadURL(
    isProd ? `app://./updater.html` : `http://localhost:8888/updater.html`
  );

  startUpdater(global.updaterWindow, () => {
    if (global.updaterWindow) {
      global.updaterWindow.close();
      global.updaterWindow = null;
    }
    createMainWindow();
  });
}

function createMainWindow() {
  if (mainWindow) {
    mainWindow.close();
  }
  
  mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isProd) {
    mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
}

app.on('ready', () => {
  createUpdaterWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('launch-app', () => {
  if (global.updaterWindow) {
    global.updaterWindow.close();
  }
  createMainWindow();
});

// Open external links in the default browser
ipcMain.on('open-external-link', (event, url) => {
  shell.openExternal(url);
});
