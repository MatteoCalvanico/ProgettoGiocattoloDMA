// Questa classe servirà per la gestione di MQTT
import mqtt from "mqtt";
import { MongoRepo } from "../repository/mongoRepository";

export class mqttService {
    client: mqtt.MqttClient

    host: string = 'localhost';
    socketPort: string = '9001'; // WebSocket
    mqttPort: string = '1885';

    socketConnectUrl: string = `ws://${this.host}:${this.socketPort}`;
    mqttConnectUrl: string = `mqtt://${this.host}:${this.mqttPort}`;

    clientId: string = `mqtt_${Math.random().toString(16).slice(3)}`;


    constructor(withSocket: boolean) {
        this.client = mqtt.connect(withSocket ? this.socketConnectUrl : this.mqttConnectUrl, {
          clientId: this.clientId,
          clean: true,
          connectTimeout: 4000,
          // Nessun username/password necessario (allow_anonymous true)
          reconnectPeriod: 1000,
        });
    }

    connect(topic: string) {
        console.log("Connection...")
        this.client.on('connect', () => {
            this.client.subscribe(topic, (err) => {
                if (!err) {
                    console.log(`Subscribed to '${topic}'`);
                }
            });
        });
    }

    save(mongo: MongoRepo) {
        // Legge continuamente da subscriber e salva in MongoDB
        if(this.client.connected) {
            this.client.on('message', async (topic, message) => {
                console.log('Received message on topic:', topic);
                console.log('Message:', message.toString());
    
                try {
                    await mongo.save(topic, message.toString());
                } catch (error) {
                    console.log('Errore in scrittura:', error)
                }
            });
        } else {
            console.log("Connect first")
        }
    }
}