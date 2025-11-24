import { ipcRenderer } from "electron";
import { Entretien } from "../shared/entretien";
import IEntretienService from "../shared/interfaces/IEntretienService";

export const entretienService = (): IEntretienService => ({
    getAll: async (): Promise<Entretien[]> => {
        return await ipcRenderer.invoke('get-entretiens');
    },
    create: async (entretien: Omit<Entretien, 'idEntretien'>, idTresorerie?: number): Promise<Entretien> => {
        return await ipcRenderer.invoke('create-entretien', entretien, idTresorerie);
    },
    delete: async (id: number): Promise<void> => {
        return await ipcRenderer.invoke('delete-entretien', id);
    }
});
