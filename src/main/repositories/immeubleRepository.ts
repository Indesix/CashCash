import Immeuble from "../../shared/immeuble";
import { PrismaClient } from "@prisma/client";

export class ImmeubleRepository {
    
    private dbclient: PrismaClient;
    constructor() {
        this.dbclient = new PrismaClient();
    }
    async getImmeubles(): Promise<Immeuble[]> {
        let immeubles = await this.dbclient.immeuble.findMany();
        return immeubles;
    }
    async addImmeuble(immeuble: Immeuble): Promise<Immeuble> {
        await this.dbclient.immeuble.create({
            data: immeuble
        });
        return immeuble;
    }

    async getImmeubleById(id: number): Promise<Immeuble | null> {
        return await this.dbclient.immeuble.findUnique({
            where: { id }
        });
    }

    async createImmeuble(immeuble: Omit<Immeuble, 'id'>): Promise<Immeuble> {
        return await this.dbclient.immeuble.create({
            data: immeuble
        });
    }

    async updateImmeuble(id: number, immeuble: Partial<Omit<Immeuble, 'id'>>): Promise<Immeuble> {
        return await this.dbclient.immeuble.update({
            where: { id },
            data: immeuble
        });
    }

    async deleteImmeuble(id: number): Promise<Immeuble> {
        return await this.dbclient.immeuble.delete({
            where: { id }
        });
    }

    async disconnect(): Promise<void> {
        await this.dbclient.$disconnect();
    }
}