import { MongoRepo } from "./repository/mongoRepository";
import { mqttService } from "./service/mqttService";

// Configurazione per il DB Mongo
const mongoUrl = "mongodb://localhost:27017/projectOne";
const mongoRepo = new MongoRepo(mongoUrl);

// Configurazione per il broker Mosquitto
const mqttServ = new mqttService(true);

// Connsessione a Mosquitto con MQTT.js
mqttServ.connect("projectOneData");

// Salvataggio messaggi
mqttServ.client.on('connect', () => {
    console.log("Connection established, setting up save handler");
    mqttServ.save(mongoRepo);
});