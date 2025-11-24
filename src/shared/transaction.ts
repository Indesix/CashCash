export default interface Transaction {
    idTransaction: number;
    dateTransaction: Date;
    montant: number;
    typeTransaction: string;
    description?: string;
    idTresorerie: number;
    idImmeuble?: number;
    idLocataire?: number;
    idEmprunt?: number;
    idEntretien?: number;
}
