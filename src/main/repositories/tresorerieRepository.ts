import { PrismaClient } from "./prisma/generated";
import { Tresorerie } from "../../shared/tresorerie";

export class TresorerieRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = new PrismaClient();
  }

  async getTresoreries(): Promise<Tresorerie[]> {
    const rows = await this.dbclient.tresorerie.findMany();

    return rows.map((t) => {
      const solde = t.SoldeInitial ? t.SoldeInitial.toNumber() : 0;
      return {
        idTresorerie: t.IdTresorerie,
        nomCompte: t.NomCompte ?? "Compte Inconnu",
        soldeInitial: solde,
        soldeActuel: solde, // TODO: Calculate based on transactions
      } as Tresorerie;
    });
  }

  async addTresorerie(tresorerie: Tresorerie): Promise<void> {
    let newId = tresorerie.idTresorerie;
    if (!newId) {
      const max = await this.dbclient.tresorerie.findFirst({
        orderBy: { IdTresorerie: "desc" },
      });
      newId = (max?.IdTresorerie ?? 0) + 1;
    }

    await this.dbclient.tresorerie.create({
      data: {
        IdTresorerie: newId,
        NomCompte: tresorerie.nomCompte,
        SoldeInitial: tresorerie.soldeInitial,
      },
    });
  }

  async updateTresorerie(id: number, tresorerie: Tresorerie): Promise<void> {
    await this.dbclient.tresorerie.update({
      where: { IdTresorerie: id },
      data: {
        NomCompte: tresorerie.nomCompte,
        SoldeInitial: tresorerie.soldeInitial,
      },
    });
  }

  async deleteTresorerie(id: number): Promise<void> {
    await this.dbclient.tresorerie.delete({
      where: { IdTresorerie: id },
    });
  }
}
