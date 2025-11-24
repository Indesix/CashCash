import { ipcRenderer } from "electron";
import ITransactionService from "../shared/interfaces/ITransactionService";

export function transactionService(): ITransactionService {
    return {
        getTransactions: () => ipcRenderer.invoke("transactionRepository:getTransactions"),
    }
}
