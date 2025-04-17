import { mqttService } from "./service/mqttService";

// Configurazione per il broker Mosquitto
const mqttServ = new mqttService(true);

// Connsessione a Mosquitto con MQTT.js

try {
  mqttServ.connect("projectOneData");
} catch (error: any) {
  console.error("Error during connection: ", error);
}

// Salvataggio messaggi
mqttServ.client.once("connect", () => {
  console.log("Connection established, setting up save handler");
  mqttServ.save();
});

mqttServ.client.on("error", (err) => {
  console.error("MQTT connection error:", err);
});
