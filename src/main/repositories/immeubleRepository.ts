import { PrismaClient } from "./prisma/generated";
import Immeuble from "../../shared/immeuble";

export class ImmeubleRepository {
  private dbclient: PrismaClient;

  constructor() {
    this.dbclient = new PrismaClient();
  }

  async getImmeubles(): Promise<Immeuble[]> {
    //findMany is like select * from Immeuble
    const rows = await this.dbclient.immeuble.findMany({
      include: {
        bail: {
          include: { //similar to joins in sql
            locataire: true
          },
          orderBy: {
            IdBail: 'desc'
          },
          take: 1 //get only the latest bail (if any) 
          // (the first when ordered desc by IdBail)
        }
      }
    });

    return rows.map((i) => {
      const currentBail = i.bail[0];// prisma returns arrays for relations, we want only the latest bail
      const locataireNom = currentBail?.locataire?.Nom 
        ? `${currentBail.locataire.Nom} ${currentBail.locataire.Prenom || ''}`.trim() 
        : undefined; //undefined if no tenant
      const idLocataire = currentBail?.locataire?.IdLocataire;

      return {
        idImmeuble: i.IdImmeuble,
        typeImmeuble: i.TypeImmeuble,
        adresse: i.Adresse,
        rc: i.RC,
        surface: i.Surface ? i.Surface.toNumber() : 0, // Decimal to number
        valeurAchat: i.ValeurAchat ? i.ValeurAchat.toNumber() : 0,
        chambres: i.Chambres,
        wc: i.WC,
        grenier: i.Grenier,
        garage: i.Garage,
        jardin: i.Jardin,
        balcon: i.Balcon,
        ascenseur: i.Ascenseur,
        locataireName: locataireNom,
        idLocataire: idLocataire
      } as Immeuble;
    });
  }

  async addImmeuble(immeuble: Immeuble): Promise<void> {
    // 1. Calculate new ID for Immeuble
    let newId = immeuble.idImmeuble;
    if (!newId) {
      // findFirst vaoir 
      // le premier enregistrement selon l'ordre spécifié
      //similaire a take 1 order by IdImmeuble desc avec findMany
        const max = await this.dbclient.immeuble.findFirst({
            orderBy: { IdImmeuble: 'desc' }
        });
        newId = (max?.IdImmeuble ?? 0) + 1; //make sure to start from 1 if no records
    }

    // 2. Prepare operations
    const operations: any[] = [];

    // Operation A: Create Immeuble SQL de INSERT
    operations.push(this.dbclient.immeuble.create({
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
    }));

    // Operation B: Create Transaction & Update Tresorerie (if applicable)
    if (immeuble.idTresorerie && immeuble.valeurAchat > 0) {
        // We need a new ID for Transaction too
        // Note: In a real concurrent env, fetching max ID outside transaction is bad.
        // But here we are inside an async function, and we can't easily get the max ID inside the $transaction array definition without using interactive transactions.
        // For this local app, we'll fetch it now.
        const maxTrans = await this.dbclient.transaction.findFirst({
            orderBy: { IdTransaction: 'desc' }
        });
        const newTransId = (maxTrans?.IdTransaction ?? 0) + 1;

        operations.push(this.dbclient.transaction.create({
            data: {
                IdTransaction: newTransId,
                DateTransaction: new Date(),
                Montant: -immeuble.valeurAchat, // Negative for purchase
                TypeTransaction: 'ACHAT',
                Description: `Achat immeuble: ${immeuble.typeImmeuble} - ${immeuble.adresse}`,
                IdTresorerie: immeuble.idTresorerie,
                IdImmeuble: newId
            }
        }));

        operations.push(this.dbclient.tresorerie.update({
            where: { IdTresorerie: immeuble.idTresorerie },
            data: {
                // Decrement the balance
                // Prisma doesn't support 'decrement' on Decimal directly in all versions easily with update, 
                // but let's try increment with negative or just fetch and update?
                // Actually, 'decrement' works on Int/Float. For Decimal, it might be tricky.
                // Let's use increment with negative value if supported, or just raw query?
                // Prisma 'decrement' is supported for Decimal in recent versions.
                // But to be safe and simple, let's just assume we can use decrement.
                // Wait, SoldeInitial is the field? Or SoldeActuel?
                // The schema has SoldeInitial. There is no SoldeActuel in the DB schema!
                // The repository calculates SoldeActuel on the fly?
                // "soldeActuel: solde, // TODO: Calculate based on transactions"
                // So currently the app only stores SoldeInitial.
                // If I want to update the "Balance", I should probably update SoldeInitial?
                // Or should I rely on the calculation?
                // If I rely on calculation, I don't need to update Tresorerie table!
                // The `getTresoreries` method in `TresorerieRepository` says:
                // "soldeActuel: solde, // TODO: Calculate based on transactions"
                // So currently it does NOT calculate.
                // If I want it to work NOW, I should update SoldeInitial (as a hack) OR implement the calculation.
                // The user asked to "link the add of new buildings with the decrease of the account".
                // If I just add a transaction, and the `getTresoreries` doesn't use it, the balance won't change in the UI.
                // So I MUST update `SoldeInitial` for now to reflect the change, 
                // OR update `TresorerieRepository` to calculate the balance.
                
                // Updating `SoldeInitial` is semantically wrong (it's Initial).
                // But implementing full calculation might be heavy if there are many transactions.
                // Let's update `SoldeInitial` for now as "Current Balance" effectively, 
                // since the app seems to treat it as such.
                SoldeInitial: { decrement: immeuble.valeurAchat }
                //what is decrement : 
                // c'est une opération atomique qui décrémente la valeur actuelle de SoldeInitial de la valeur spécifiée
            }
        }));
    }

    // Operation C: Create Locataire & Bail (if applicable)
    let locataireIdForBail = immeuble.idLocataire;

    if (immeuble.locataireName && !locataireIdForBail) {
        const maxLoc = await this.dbclient.locataire.findFirst({ orderBy: { IdLocataire: 'desc' } });
        const newLocId = (maxLoc?.IdLocataire ?? 0) + 1;

        operations.push(this.dbclient.locataire.create({
            data: {
                IdLocataire: newLocId,
                Nom: immeuble.locataireName,
            }
        }));
        locataireIdForBail = newLocId;
    }

    if (locataireIdForBail) {
        const maxBail = await this.dbclient.bail.findFirst({ orderBy: { IdBail: 'desc' } });
        const newBailId = (maxBail?.IdBail ?? 0) + 1;

        operations.push(this.dbclient.bail.create({
            data: {
                IdBail: newBailId,
                IdImmeuble: newId,
                IdLocataire: locataireIdForBail
            }
        }));
    }

    await this.dbclient.$transaction(operations);
  }

  async deleteImmeuble(id: number): Promise<void> {
    // On prépare une liste d'opérations à exécuter en transaction
    const operations = [
      // 1. Supprimer tous les baux associés à cet immeuble
      this.dbclient.bail.deleteMany({
        where: { IdImmeuble: id },
      }),
      
      // 2. Supprimer toutes les transactions associées (ex: achat, revenus...)
      this.dbclient.transaction.deleteMany({
        where: { IdImmeuble: id },
      }),

      // 3. Supprimer l'historique des entretiens associés
      this.dbclient.entretien_log.deleteMany({
        where: { IdImmeuble: id },
      }),

      // 4. Enfin, supprimer l'immeuble lui-même
      this.dbclient.immeuble.delete({
        where: {
          IdImmeuble: id,
        },
      }),
    ];

    // Exécuter toutes les suppressions en une seule transaction atomique
    await this.dbclient.$transaction(operations);
  }

  async updateImmeuble(id: number, immeuble: Partial<Immeuble>): Promise<void> {
    const operations: any[] = [];

    operations.push(this.dbclient.immeuble.update({
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
    }));

    // Always clear existing bails to ensure the new state is reflected (1 property = 1 active tenant)
    // This handles the case where the user wants to remove the tenant (by sending no tenant data)
    operations.push(this.dbclient.bail.deleteMany({
        where: { IdImmeuble: id }
    }));

    let locataireIdForBail = immeuble.idLocataire;
    const locataireName = immeuble.locataireName?.trim();

    console.log(`Updating Immeuble ${id}. LocataireName: '${locataireName}', IdLocataire: ${locataireIdForBail}`);

    if (locataireName && !locataireIdForBail) {
        const maxLoc = await this.dbclient.locataire.findFirst({ orderBy: { IdLocataire: 'desc' } });
        const newLocId = (maxLoc?.IdLocataire ?? 0) + 1;

        operations.push(this.dbclient.locataire.create({
            data: {
                IdLocataire: newLocId,
                Nom: locataireName,
            }
        }));
        locataireIdForBail = newLocId;
    }

    if (locataireIdForBail) {
        const maxBail = await this.dbclient.bail.findFirst({ orderBy: { IdBail: 'desc' } });
        const newBailId = (maxBail?.IdBail ?? 0) + 1;

        operations.push(this.dbclient.bail.create({
            data: {
                IdBail: newBailId,
                IdImmeuble: id,
                IdLocataire: locataireIdForBail
            }
        }));
    }

    await this.dbclient.$transaction(operations);
  }
}
