import { Locataire } from "../locataire";

export default interface ILocataireService {
    getAll: () => Promise<Locataire[]>;
    create: (locataire: Omit<Locataire, 'idLocataire'>) => Promise<Locataire>;
    delete: (id: number) => Promise<void>;
}
