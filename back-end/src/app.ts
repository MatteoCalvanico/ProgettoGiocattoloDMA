import Fastify from 'fastify'
import { mongoRepo } from './repository/mongoRepository';
import { controller } from './controller/controller';

const fastify = Fastify({
  logger: true
})

// Connessione a MongoDB con Mongoose
const mongoUrl = "mongodb://localhost:27017/projectOne";
const mongoRepository = new mongoRepo(mongoUrl);

// Inizializzazione controller
const c = new controller(mongoRepository);

// Rotta per prendere tutti i messaggi
fastify.get('/all', (req, reply) => c.findAll(req, reply))

// Listener per request
fastify.listen({ port: 8080 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})