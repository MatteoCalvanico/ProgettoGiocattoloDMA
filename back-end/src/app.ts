import Fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { mongoRepo } from "./repository/mongoRepository";
import { controller } from "./controller/controller";
import { MessageHandler } from "./handlers/messages";

// Funzione che crea e configura l'app
export function buildApp() {
  const fastify = Fastify({
    logger: true,
  }) as FastifyInstance;

  // Inizializzazione controller
  const c = new controller(new MessageHandler(new mongoRepo()));

  // Rotta per prendere tutti i messaggi
  fastify.get("/", (req: FastifyRequest, reply: FastifyReply) =>
    c.findAll(req, reply, true)
  );

  // Rotta per cercare messaggi per timestamp
  fastify.get("/:timestamp", (req: FastifyRequest, reply: FastifyReply) =>
    c.findStamp(req, reply, true)
  );

  return fastify;
}

// Crea l'app
const fastify = buildApp();

// Avvia il server solo app.ts viene eseguito direttamente
if (require.main === module) {
  fastify.listen({ port: 8080, host: "0.0.0.0" }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`server listening on ${address}`);
  });
}

export { fastify };
