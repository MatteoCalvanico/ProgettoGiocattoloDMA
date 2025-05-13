import { mqttService } from "./service/mqttService";

// Configurazione per il broker RabbitMQ
const mqttServ = new mqttService(true);

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
