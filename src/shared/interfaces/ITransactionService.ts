import Transaction from "../../shared/transaction";

export default interface ITransactionService {
    getTransactions(): Promise<Transaction[]>;
}
