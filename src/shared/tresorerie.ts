export interface Tresorerie {
    idTresorerie: number;
    nomCompte: string;
    soldeInitial: number;
    soldeActuel?: number; // Calculated field
}
