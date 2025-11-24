import { PrismaClient } from './prisma/generated';
import { Locataire } from '../../shared/locataire';

const prisma = new PrismaClient();

export const getAllLocataires = async (): Promise<Locataire[]> => {
  const locataires = await prisma.locataire.findMany();
  return locataires.map(l => ({
    idLocataire: l.IdLocataire,
    nom: l.Nom || '',
    prenom: l.Prenom || '',
    age: l.Age || 0,
    travail: l.Travail || '',
    salaire: l.Salaire ? Number(l.Salaire) : 0,
    marie: l.Marie || false,
    enfant: l.Enfants || 0
  }));
};

export const createLocataire = async (locataire: Omit<Locataire, 'idLocataire'>): Promise<Locataire> => {
  const lastId = await prisma.locataire.findFirst({
    orderBy: { IdLocataire: 'desc' }
  });
  const newId = (lastId?.IdLocataire || 0) + 1;

  const created = await prisma.locataire.create({
    data: {
      IdLocataire: newId,
      Nom: locataire.nom,
      Prenom: locataire.prenom,
      Age: locataire.age,
      Travail: locataire.travail,
      Salaire: locataire.salaire,
      Marie: locataire.marie,
      Enfants: locataire.enfant
    }
  });

  return {
    idLocataire: created.IdLocataire,
    nom: created.Nom || '',
    prenom: created.Prenom || '',
    age: created.Age || 0,
    travail: created.Travail || '',
    salaire: created.Salaire ? Number(created.Salaire) : 0,
    marie: created.Marie || false,
    enfant: created.Enfants || 0
  };
};

export const deleteLocataire = async (id: number): Promise<void> => {
  // Delete associated bails first
  await prisma.bail.deleteMany({
    where: { IdLocataire: id }
  });

  await prisma.locataire.delete({
    where: { IdLocataire: id }
  });
};
