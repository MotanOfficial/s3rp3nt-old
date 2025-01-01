import { ipcMain } from 'electron';
import { app } from 'electron';

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
