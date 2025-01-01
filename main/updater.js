import { ipcMain, app } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

log.transports.file.level = 'info';
autoUpdater.logger = log;

const isDev = !app.isPackaged;

export function startUpdater(updaterWindow, onComplete) {
  if (isDev) {
    log.info('Running in development mode. Skipping update checks.');
    updaterWindow.webContents.once('did-finish-load', () => {
      updaterWindow.webContents.send('update-message', 'Running in development mode. Skipping updates...');
      setTimeout(onComplete, 2000); // Proceed to main window after 2 seconds
    });
    return;
  }

  autoUpdater.autoDownload = false;

  updaterWindow.webContents.once('did-finish-load', () => {
    updaterWindow.webContents.send('update-message', 'Checking for updates...');
    autoUpdater.checkForUpdates().catch(error => {
      log.error('Error checking for updates:', error);
      if (error.message.includes('No published versions on GitHub')) {
        updaterWindow.webContents.send('update-message', 'No published versions on GitHub. Please check again later.');
      } else {
        updaterWindow.webContents.send('update-message', `Error: ${error.message}`);
      }
      setTimeout(onComplete, 3000); // Proceed to main window after error
    });
  });

  autoUpdater.on('update-available', () => {
    updaterWindow.webContents.send('update-message', 'Update available. Would you like to update?');
    updaterWindow.webContents.send('show-buttons', true); // Show buttons only if update is available
  });

  autoUpdater.on('update-not-available', () => {
    updaterWindow.webContents.send('update-message', 'No updates available.');
    setTimeout(onComplete, 2000); // Proceed to main window after 2 seconds
  });

  autoUpdater.on('error', (error) => {
    log.error('Error in auto-updater:', error);
    updaterWindow.webContents.send('update-message', `Error: ${error.message}`);
    setTimeout(onComplete, 3000); // Proceed to main window after error
  });

  ipcMain.on('updater-response', (event, response) => {
    if (response === 'yes') {
      updaterWindow.webContents.send('update-message', 'Downloading update...');
      autoUpdater.downloadUpdate();
    } else {
      updaterWindow.webContents.send('update-message', 'Skipping update...');
      setTimeout(onComplete, 2000); // Proceed to main window after delay
    }
  });

  autoUpdater.on('download-progress', (progressObj) => {
    updaterWindow.webContents.send(
      'update-message',
      `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent.toFixed(2)}%`
    );
  });

  autoUpdater.on('update-downloaded', () => {
    updaterWindow.webContents.send('update-message', 'Update downloaded. Installing...');
    setTimeout(() => autoUpdater.quitAndInstall(), 2000);
  });
}
