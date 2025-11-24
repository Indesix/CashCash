import Immeuble  from "../immeuble"


export default interface IImmeubleService {
    getImmeubles:() => Promise<Immeuble[]>
    addImmeuble:(immeuble: Immeuble) => Promise<void>
    deleteImmeuble:(id: number) => Promise<void>
    updateImmeuble:(immeuble: Immeuble) => Promise<void>
    toggleImmeuble:(id: number) => Promise<void>
}