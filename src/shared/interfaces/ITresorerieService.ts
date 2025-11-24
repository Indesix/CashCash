import { Tresorerie } from "../tresorerie";

export default interface ITresorerieService {
    getTresoreries(): Promise<Tresorerie[]>;
    addTresorerie(tresorerie: Tresorerie): Promise<void>;
    updateTresorerie(tresorerie: Tresorerie): Promise<void>;
    deleteTresorerie(id: number): Promise<void>;
}
