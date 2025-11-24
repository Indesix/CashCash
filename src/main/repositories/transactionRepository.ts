import { PrismaClient } from "./prisma/generated";
import Transaction from "../../shared/transaction";

export class TransactionRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = new PrismaClient();
  }

  async getTransactions(): Promise<Transaction[]> {
    const rows = await this.dbclient.transaction.findMany({
      orderBy: { DateTransaction: 'desc' },
      take: 50 // Limit to last 50 transactions for performance
    });

    return rows.map((t) => {
      return {
        idTransaction: t.IdTransaction,
        dateTransaction: t.DateTransaction,
        montant: t.Montant.toNumber(),
        typeTransaction: t.TypeTransaction,
        description: t.Description ?? undefined,
        idTresorerie: t.IdTresorerie,
        idImmeuble: t.IdImmeuble ?? undefined,
        idLocataire: t.IdLocataire ?? undefined,
        idEmprunt: t.IdEmprunt ?? undefined,
        idEntretien: t.IdEntretien ?? undefined,
      } as Transaction;
    });
  }
}
