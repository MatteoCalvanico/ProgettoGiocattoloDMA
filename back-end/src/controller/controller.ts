import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { MessageHandler } from "../handlers/messages";

export class controller {
  private handler: MessageHandler;

  constructor(handler: MessageHandler) {
    this.handler = handler;
  }

  async findAll(
    request: FastifyRequest,
    reply: FastifyReply,
    isSeries: boolean
  ) {
    try {
      const messages = await this.handler.findAllMessages(isSeries);
      reply.send({ messages });
    } catch (error: any) {
      reply.code(500).send({ success: false, error: error.message });
    }
  }

  async findStamp(
    request: FastifyRequest,
    reply: FastifyReply,
    isSeries: boolean
  ) {
    try {
      const { timestamp } = request.params as { timestamp: string };
      z.string().datetime().parse(timestamp);
      const message = await this.handler.findByStamp(isSeries, timestamp);
      reply.send({ message });
    } catch (error: any) {
      reply.code(500).send({ success: false, error: error.message });
    }
  }
}
