import { ipcRenderer } from "electron";
import ITresorerieService from "../shared/interfaces/ITresorerieService";
import { Tresorerie } from "../shared/tresorerie";

export function tresorerieService(): ITresorerieService {
    return {
        getTresoreries: () => ipcRenderer.invoke("tresorerieRepository:getTresoreries"),
        addTresorerie: (tresorerie: Tresorerie) => ipcRenderer.invoke("tresorerieRepository:addTresorerie", tresorerie),
        updateTresorerie: (tresorerie: Tresorerie) => ipcRenderer.invoke("tresorerieRepository:updateTresorerie", tresorerie),
        deleteTresorerie: (id: number) => ipcRenderer.invoke("tresorerieRepository:deleteTresorerie", id)
    }
}
