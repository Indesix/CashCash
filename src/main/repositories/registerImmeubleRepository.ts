import { ipcMain } from "electron";
import { ImmeubleRepository } from "../repositories/immeubleRepository";
import Immeuble from "../../shared/immeuble";

export function registerImmeubleRepository() {



    const immeubleRepository =  new ImmeubleRepository();
    
    ipcMain.handle("immeuble:getImmeubles",  (event, immeubleData) => {
        return immeubleRepository.getImmeubles();
    });

    ipcMain.handle("immeuble:addImmeuble",  (event, immeuble:Immeuble) => {
        return immeubleRepository.addImmeuble(immeuble);
    }); 
}