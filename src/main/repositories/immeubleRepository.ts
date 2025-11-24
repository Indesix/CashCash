import { PrismaClient } from "./prisma/generated";
import Immeuble from "../../shared/immeuble";

export class ImmeubleRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = new PrismaClient();
  }

  async getImmeubles(): Promise<Immeuble[]> {
    const rows = await this.dbclient.immeuble.findMany();

    return rows.map((i) => {
      return {
        idImmeuble: i.IdImmeuble,
        typeImmeuble: i.TypeImmeuble,
        adresse: i.Adresse,
        rc: i.RC,
        surface: i.Surface ? i.Surface.toNumber() : 0,
        valeurAchat: i.ValeurAchat ? i.ValeurAchat.toNumber() : 0,
        chambres: i.Chambres,
        wc: i.WC,
        grenier: i.Grenier,
        garage: i.Garage,
        jardin: i.Jardin,
        balcon: i.Balcon,
        ascenseur: i.Ascenseur,
      } as Immeuble;
    });
  }

  async addImmeuble(immeuble: Immeuble): Promise<void> {
    let newId = immeuble.idImmeuble;
    if (!newId) {
        const max = await this.dbclient.immeuble.findFirst({
            orderBy: { IdImmeuble: 'desc' }
        });
        newId = (max?.IdImmeuble ?? 0) + 1;
    }

    await this.dbclient.immeuble.create({
      data: {
        IdImmeuble: newId,
        TypeImmeuble: immeuble.typeImmeuble,
        Adresse: immeuble.adresse,
        RC: immeuble.rc,
        Surface: immeuble.surface,
        ValeurAchat: immeuble.valeurAchat,
        Chambres: immeuble.chambres,
        WC: immeuble.wc,
        Grenier: immeuble.grenier,
        Garage: immeuble.garage ?? false,
        Jardin: immeuble.jardin,
        Balcon: immeuble.balcon,
        Ascenseur: immeuble.ascenseur
      },
    });
  }

  async deleteImmeuble(id: number): Promise<void> {
    await this.dbclient.immeuble.delete({
      where: {
        IdImmeuble: id,
      },
    });
  }

  async updateImmeuble(id: number, immeuble: Partial<Immeuble>): Promise<void> {
    await this.dbclient.immeuble.update({
      where: { IdImmeuble: id },
      data: {
        TypeImmeuble: immeuble.typeImmeuble,
        Adresse: immeuble.adresse,
        RC: immeuble.rc,
        Surface: immeuble.surface,
        ValeurAchat: immeuble.valeurAchat,
        Chambres: immeuble.chambres,
        WC: immeuble.wc,
        Grenier: immeuble.grenier,
        Garage: immeuble.garage ?? false,
        Jardin: immeuble.jardin,
        Balcon: immeuble.balcon,
        Ascenseur: immeuble.ascenseur
      },
    });
  }
}
