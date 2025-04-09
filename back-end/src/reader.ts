import Fastify from 'fastify'
import { MongoRepo } from './repository/mongoRepository';

const fastify = Fastify({
  logger: true
})

// Connessione a MongoDB con Mongoose
const mongoUrl = "mongodb://localhost:27017/projectOne";
const mongoRepo = new MongoRepo(mongoUrl);

// Rotta per prendere tutti i messaggi
fastify.get('/all', async function (request, reply) {
  const messages = await mongoRepo.find(null);
  reply.send({ messages })
})

fastify.listen({ port: 8080 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})