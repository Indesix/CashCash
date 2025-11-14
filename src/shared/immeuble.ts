export default interface Immeuble {
    id: number;
    nom: string;
    adresse: string;
    codePostal: string;
    ville: string;
    pays: string;
    type: string;
    nombreEtages: number;
    dateConstruction: Date;
    proprietaireId: number;
}