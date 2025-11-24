import { ipcRenderer } from "electron";
import { Locataire } from "../shared/locataire";

export const locataireService = () => ({
    getAll: async (): Promise<Locataire[]> => {
        return await ipcRenderer.invoke('get-locataires');
    },
    create: async (locataire: Omit<Locataire, 'idLocataire'>): Promise<Locataire> => {
        return await ipcRenderer.invoke('create-locataire', locataire);
    },
    delete: async (id: number): Promise<void> => {
        return await ipcRenderer.invoke('delete-locataire', id);
    }
});
