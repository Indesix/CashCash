import { registerImmeubleRepository } from "./repositories/registerImmeubleRepository";
import { registerTresorerieRepository } from "./repositories/registerTresorerieRepository";


export function registerRepositories() {
    registerImmeubleRepository();
    registerTresorerieRepository();
}

