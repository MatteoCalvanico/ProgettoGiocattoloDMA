// Questa classe servirà per la gestione di MQTT
import mqtt from "mqtt";
import { mongoRepo } from "../repository/mongoRepository";

export class mqttService {
  client: mqtt.MqttClient;
  mongo: mongoRepo = new mongoRepo();

  private host: string = process.env.MQTT_HOST || "localhost";
  private socketPort: string = process.env.MQTT_WS_PORT || "15675";
  private mqttPort: string = process.env.MQTT_PORT || "1883";

  private socketConnectUrl: string = `ws://${this.host}:${this.socketPort}/ws`;
  private mqttConnectUrl: string = `mqtt://${this.host}:${this.mqttPort}`;

  private clientId: string = `mqtt_${Math.random().toString(16).slice(3)}`;
  private flag = false; // Evita che ad ogni riconnessione venga ricreato un handler

  constructor(withSocket: boolean) {
    this.client = mqtt.connect(
      withSocket ? this.socketConnectUrl : this.mqttConnectUrl,
      {
        clientId: this.clientId,
        clean: true,
        connectTimeout: 4000,
        // RabbitMQ credentials
        username: process.env.RABBITMQ_USER || "guest",
        password: process.env.RABBITMQ_PASSWORD || "guest",
        reconnectPeriod: 1000,
      }
    );
  }

  connect(topic: string) {
    console.log("Connection...");
    this.client.on("connect", () => {
      this.client.subscribe(topic, { qos: 2 }, (err) => {
        if (!err) {
          console.log(`Subscribed to '${topic}'`);
        }
      });
    });
  }

  /**
   * Legge continuamente da subscriber e salva in MongoDB
   */
  save() {
    if (this.flag) {
      console.log("Message handler already registered");
      return;
    }

    if (!this.client.connected) {
      console.log("Connect first");
      return;
    }

    // Rimuoviamo altri "handler", per evitare che i messaggi vengano duplicati
    this.client.removeAllListeners("message");

    this.client.on("message", async (topic, message) => {
      console.log("Received message on topic:", topic);
      console.log("Message:", message.toString());

      await this.mongo.saveSeries({
        topic: topic,
        payload: message.toString(),
      });
    });

    this.flag = true;
  }
}
