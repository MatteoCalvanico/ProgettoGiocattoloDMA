import Fastify from "fastify";
import { mongoRepo } from "./repository/mongoRepository";
import { controller } from "./controller/controller";

const fastify = Fastify({
  logger: true,
});

// Inizializzazione controller
const c = new controller(new mongoRepo());

// Rotta per prendere tutti i messaggi
fastify.get("/", (req, reply) => c.findAll(req, reply, true));

// Rotta per cercare messaggi per timestamp
fastify.get("/:timestamp", (req, reply) => c.findStamp(req, reply, true));

// Listener per request
fastify.listen({ port: 8080, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});
