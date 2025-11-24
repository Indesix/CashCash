import { ipcMain } from 'electron';
import { getAllEntretiens, createEntretien, deleteEntretien } from './entretienRepository';

export const registerEntretienHandlers = () => {
  ipcMain.removeHandler('get-entretiens');
  ipcMain.handle('get-entretiens', async () => {
    return await getAllEntretiens();
  });

  ipcMain.removeHandler('create-entretien');
  ipcMain.handle('create-entretien', async (event, entretien, idTresorerie) => {
    return await createEntretien(entretien, idTresorerie);
  });

  ipcMain.removeHandler('delete-entretien');
  ipcMain.handle('delete-entretien', async (event, id) => {
    return await deleteEntretien(id);
  });
};
