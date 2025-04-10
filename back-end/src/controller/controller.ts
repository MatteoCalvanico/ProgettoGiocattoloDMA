import { FastifyReply, FastifyRequest } from "fastify";
import { mongoRepo } from "../repository/mongoRepository";
import { z } from "zod";

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

    async findStamp(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { timestamp } = request.params as { timestamp: string };
            z.string().datetime().parse(timestamp);
            const message = await this.mongoRepository.findByTimestamp(timestamp);
            reply.send({ message });
        } catch (error: any) {
            reply.code(500).send({success: false, error: error.message})
        }
    }
}

