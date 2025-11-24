import { ipcRenderer } from "electron"
import IImmeubleService from "../shared/interfaces/IImmeubleService"
import Immeuble from "../shared/immeuble"

export function immeubleService(): IImmeubleService {
    return { 
        getImmeubles: () => ipcRenderer.invoke("immeubleRepository:getImmeubles"),
        addImmeuble: (immeuble: Immeuble) => ipcRenderer.invoke("immeubleRepository:addImmeuble", immeuble),
        updateImmeuble: (immeuble: Immeuble) => ipcRenderer.invoke("immeubleRepository:updateImmeuble", immeuble),
        deleteImmeuble: (id: number) => ipcRenderer.invoke("immeubleRepository:deleteImmeuble", id),
        toggleImmeuble: (id: number) => ipcRenderer.invoke("immeubleRepository:toggleImmeuble", id)
    }
}