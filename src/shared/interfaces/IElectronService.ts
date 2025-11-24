import IImmeubleService from "./IImmeubleService"
import ITresorerieService from "./ITresorerieService"
import ITransactionService from "./ITransactionService"
import ILocataireService from "./ILocataireService"
import IEntretienService from "./IEntretienService"

export default interface IElectronService {
    immeubles: IImmeubleService
    tresoreries: ITresorerieService
    transactions: ITransactionService
    locataires: ILocataireService
    entretiens: IEntretienService
}

declare global {
    interface Window {
        electronService: IElectronService
    }
}