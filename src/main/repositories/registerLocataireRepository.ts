import { ipcMain } from 'electron';
import { getAllLocataires, createLocataire, deleteLocataire } from './locataireRepository';

export const registerLocataireHandlers = () => {
  ipcMain.removeHandler('get-locataires');
  ipcMain.handle('get-locataires', async () => {
    return await getAllLocataires();
  });

  ipcMain.removeHandler('create-locataire');
  ipcMain.handle('create-locataire', async (event, locataire) => {
    return await createLocataire(locataire);
  });

  ipcMain.removeHandler('delete-locataire');
  ipcMain.handle('delete-locataire', async (event, id) => {
    return await deleteLocataire(id);
  });
};
