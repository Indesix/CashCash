import IImmeubleService from "./IImmeubleService"
import ITresorerieService from "./ITresorerieService"

export default interface IElectronService {
    immeubles: IImmeubleService
    tresoreries: ITresorerieService
}

declare global {
    interface Window {
        electronService: IElectronService
    }
}