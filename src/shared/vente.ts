export default interface Vente {
    id: number;
    dateVente: Date;
    montantVente: number;
    acheteurId: number;
    immeubleId: number;
}