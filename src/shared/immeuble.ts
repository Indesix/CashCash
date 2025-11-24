export default interface Immeuble {
    idImmeuble?: number;
    typeImmeuble: string;
    adresse: string;
    rc: number;
    surface: number;
    valeurAchat: number;
    idTresorerie: number;
    chambres: number;
    wc: number;
    grenier: boolean;
    garage?: boolean;
    jardin: boolean;
    balcon: boolean;
    ascenseur: boolean;
    loyerCommerce?: number;
    typeCommerce?: string;
    studic?: boolean;
    commun?: boolean;
    nbColocs?: number;
}
