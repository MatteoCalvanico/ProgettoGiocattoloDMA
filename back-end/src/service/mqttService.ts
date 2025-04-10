// Questa classe servirà per la gestione di MQTT
import mqtt from "mqtt";
import { mongoRepo } from "../repository/mongoRepository";

export class mqttService {
    client: mqtt.MqttClient

    private host: string = 'localhost';
    private socketPort: string = '9001'; // WebSocket
    private mqttPort: string = '1885';

    private socketConnectUrl: string = `ws://${this.host}:${this.socketPort}`;
    private mqttConnectUrl: string = `mqtt://${this.host}:${this.mqttPort}`;

    private clientId: string = `mqtt_${Math.random().toString(16).slice(3)}`;


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

    save(mongo: mongoRepo) {
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