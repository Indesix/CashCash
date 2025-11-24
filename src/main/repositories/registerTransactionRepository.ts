import { ipcMain } from "electron";
import { TransactionRepository } from "../repositories/transactionRepository";

export function registerTransactionRepository() {
    const transactionRepository = new TransactionRepository();
    
    ipcMain.removeHandler("transactionRepository:getTransactions");
    ipcMain.handle("transactionRepository:getTransactions", (event) => {
        return transactionRepository.getTransactions();
    });
}
