import { ipcMain } from "electron";
import { TresorerieRepository } from "../repositories/tresorerieRepository";
import { Tresorerie } from "../../shared/tresorerie";

export function registerTresorerieRepository() {
    const tresorerieRepository = new TresorerieRepository();
    
    ipcMain.removeHandler("tresorerieRepository:getTresoreries");
    ipcMain.handle("tresorerieRepository:getTresoreries", (event) => {
        return tresorerieRepository.getTresoreries();
    });

    ipcMain.removeHandler("tresorerieRepository:addTresorerie");
    ipcMain.handle("tresorerieRepository:addTresorerie", (event, tresorerie: Tresorerie) => {
        return tresorerieRepository.addTresorerie(tresorerie);
    });

    ipcMain.removeHandler("tresorerieRepository:updateTresorerie");
    ipcMain.handle("tresorerieRepository:updateTresorerie", (event, tresorerie: Tresorerie) => {
        return tresorerieRepository.updateTresorerie(tresorerie.idTresorerie!, tresorerie);
    });

    ipcMain.removeHandler("tresorerieRepository:deleteTresorerie");
    ipcMain.handle("tresorerieRepository:deleteTresorerie", (event, id: number) => {
        return tresorerieRepository.deleteTresorerie(id);
    });
}
