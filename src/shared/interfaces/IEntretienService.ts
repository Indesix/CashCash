import { Entretien } from "../entretien";

export default interface IEntretienService {
    getAll: () => Promise<Entretien[]>;
    create: (entretien: Omit<Entretien, 'idEntretien'>, idTresorerie?: number) => Promise<Entretien>;
    delete: (id: number) => Promise<void>;
}
