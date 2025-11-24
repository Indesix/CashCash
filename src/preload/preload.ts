import { contextBridge, ipcRenderer } from "electron";
import { immeubleService } from "./immeubleService";
import { tresorerieService } from "./tresorerieService";
import { transactionService } from "./transactionService";
import { locataireService } from "./locataireService";
import { entretienService } from "./entretienService";
import IElectronService from "../shared/interfaces/IElectronService";

contextBridge.exposeInMainWorld("electronService", {
    immeubles: immeubleService(),
    tresoreries: tresorerieService(),
    transactions: transactionService(),
    locataires: locataireService(),
    entretiens: entretienService()
} as IElectronService)