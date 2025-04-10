import { FastifyReply, FastifyRequest } from "fastify";
import { mongoRepo } from "../repository/mongoRepository";

export class controller {
    private mongoRepository: mongoRepo

    constructor(mongoRepos: mongoRepo) {
        this.mongoRepository = mongoRepos
    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const messages = await this.mongoRepository.find(null);
            reply.send({ messages })
        } catch (error: any) {
            reply.code(500).send({ success: false, error: error.message });
        }
    }
}

