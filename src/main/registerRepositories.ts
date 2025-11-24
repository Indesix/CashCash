import { registerImmeubleRepository } from "./repositories/registerImmeubleRepository";
import { registerTresorerieRepository } from "./repositories/registerTresorerieRepository";
import { registerTransactionRepository } from "./repositories/registerTransactionRepository";
import { registerLocataireHandlers } from "./repositories/registerLocataireRepository";
import { registerEntretienHandlers } from "./repositories/registerEntretienRepository";


export function registerRepositories() {
    registerImmeubleRepository();
    registerTresorerieRepository();
    registerTransactionRepository();
    registerLocataireHandlers();
    registerEntretienHandlers();
}

