export interface Immeuble {
    idImmeuble: number;
    typeImmeuble: string;
    adresse: string;
    valeurAchat: number;
    surface: number;
    chambres?: number;
    loyerCommerce?: number;
}

export interface Tresorerie {
    idTresorerie: number;
    nomCompte: string;
    soldeInitial: number;
    soldeActuel: number;
}
