import { PrismaClient } from './prisma/generated';
import { Entretien } from '../../shared/entretien';

const prisma = new PrismaClient();

export const getAllEntretiens = async (): Promise<Entretien[]> => {
  const rows = await prisma.entretien_log.findMany({
    orderBy: { DateHeure: 'asc' }
  });
  return rows.map(r => ({
    idEntretien: r.IdEntretien,
    dateHeure: r.DateHeure ? new Date(r.DateHeure) : new Date(),
    responsable: r.Responsable || '',
    description: r.Description || '',
    cout: r.Cout ? Number(r.Cout) : 0,
    idImmeuble: r.IdImmeuble || 0
  }));
};

export const createEntretien = async (entretien: Omit<Entretien, 'idEntretien'>, idTresorerie?: number): Promise<Entretien> => {
  // 1. Get new ID
  const last = await prisma.entretien_log.findFirst({ orderBy: { IdEntretien: 'desc' } });
  const newId = (last?.IdEntretien || 0) + 1;

  const operations: any[] = [];

  // 2. Create Entretien Log
  operations.push(prisma.entretien_log.create({
    data: {
      IdEntretien: newId,
      DateHeure: entretien.dateHeure,
      Responsable: entretien.responsable,
      Description: entretien.description,
      Cout: entretien.cout,
      IdImmeuble: entretien.idImmeuble
    }
  }));

  // 3. If cost > 0 and treasury selected, create Transaction & Update Treasury
  if (entretien.cout > 0 && idTresorerie) {
    const lastTrans = await prisma.transaction.findFirst({ orderBy: { IdTransaction: 'desc' } });
    const newTransId = (lastTrans?.IdTransaction || 0) + 1;

    operations.push(prisma.transaction.create({
      data: {
        IdTransaction: newTransId,
        DateTransaction: new Date(), // Transaction date is now, even if maintenance is future? Or should match maintenance date? Usually payment is now or later. Let's assume payment is now for simplicity or match maintenance date. Let's use maintenance date.
        Montant: -entretien.cout,
        TypeTransaction: 'ENTRETIEN',
        Description: `Entretien: ${entretien.description}`,
        IdTresorerie: idTresorerie,
        IdImmeuble: entretien.idImmeuble,
        IdEntretien: newId
      }
    }));

    // Update Treasury Balance
    operations.push(prisma.tresorerie.update({
        where: { IdTresorerie: idTresorerie },
        data: {
            SoldeInitial: { decrement: entretien.cout }
        }
    }));
  }

  await prisma.$transaction(operations);

  return {
    idEntretien: newId,
    ...entretien
  };
};

export const deleteEntretien = async (id: number): Promise<void> => {
  await prisma.entretien_log.delete({ where: { IdEntretien: id } });
};
