import { contextBridge, ipcRenderer } from "electron";
import { immeubleService } from "./immeubleService";
import { tresorerieService } from "./tresorerieService";
import IElectronService from "../shared/interfaces/IElectronService";

contextBridge.exposeInMainWorld("electronService", {
    immeubles: immeubleService(),
    tresoreries: tresorerieService()
} as IElectronService)