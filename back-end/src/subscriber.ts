import { mongoRepo } from "./repository/mongoRepository";
import { mqttService } from "./service/mqttService";

// Configurazione per il DB Mongo
//const mongoUrl = "mongodb://localhost:27017/projectOne";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/projectOne";
const mongoRepository = new mongoRepo(mongoUrl);

// Configurazione per il broker Mosquitto
const mqttServ = new mqttService(true);

// Connsessione a Mosquitto con MQTT.js
mqttServ.connect("projectOneData");

// Salvataggio messaggi
mqttServ.client.once('connect', () => {
    console.log("Connection established, setting up save handler");
    mqttServ.save(mongoRepository);
});

mqttServ.client.on('error', (err) => {
    console.error("MQTT connection error:", err);
});