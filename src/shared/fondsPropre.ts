export default interface FondsPropre { 
    id: number;
    montant: number;
    date: Date;
    proprietaireId: number;
    totalActifs: number;
    totalPassifs: number;
    totalDisponible: number;
}