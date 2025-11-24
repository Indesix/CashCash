import { ipcMain } from "electron";
import { ImmeubleRepository } from "../repositories/immeubleRepository";
import Immeuble from "../../shared/immeuble";

export function registerImmeubleRepository() {



    const immeubleRepository =  new ImmeubleRepository();
    
    ipcMain.removeHandler("immeubleRepository:getImmeubles");
    ipcMain.handle("immeubleRepository:getImmeubles",  (event, immeubleData) => {
        return immeubleRepository.getImmeubles();
    });

    ipcMain.removeHandler("immeubleRepository:addImmeuble");
    ipcMain.handle("immeubleRepository:addImmeuble",  (event, immeuble:Immeuble) => {
        return immeubleRepository.addImmeuble(immeuble);
    }); 

    ipcMain.removeHandler("immeubleRepository:deleteImmeuble");
    ipcMain.handle("immeubleRepository:deleteImmeuble",  (event, id: number) => {
        return immeubleRepository.deleteImmeuble(id);
    });

    ipcMain.removeHandler("immeubleRepository:updateImmeuble");
    ipcMain.handle("immeubleRepository:updateImmeuble",  (event, immeuble: Immeuble) => {
        return immeubleRepository.updateImmeuble(immeuble.idImmeuble!, immeuble);
    }); 
}