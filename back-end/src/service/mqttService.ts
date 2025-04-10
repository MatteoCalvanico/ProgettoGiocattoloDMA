// Questa classe servirà per la gestione di MQTT
import mqtt from "mqtt";
import { mongoRepo } from "../repository/mongoRepository";

export class mqttService {
    client: mqtt.MqttClient

    private host: string = process.env.MQTT_HOST || 'localhost';
    private socketPort: string = process.env.MQTT_WS_PORT || '9001';
    private mqttPort: string = process.env.MQTT_PORT || '1885';

    private socketConnectUrl: string = `ws://${this.host}:${this.socketPort}`;
    private mqttConnectUrl: string = `mqtt://${this.host}:${this.mqttPort}`;

    private clientId: string = `mqtt_${Math.random().toString(16).slice(3)}`;
    private flag = false; // Evita che ad ogni riconnessione venga ricreato un handler

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

    /**
     * Legge continuamente da subscriber e salva in MongoDB
     * @param mongo Repository da usare per salvare su MongoDB
     */
    save(mongo: mongoRepo) {
        if (this.flag) {
            console.log("Message handler already registered");
            return;
        }
        
        if(!this.client.connected) {
            console.log("Connect first");
            return;
        }
        
        // Rimuoviamo altri "handler", per evitare che i messaggi vengano duplicati
        this.client.removeAllListeners('message');
        
        this.client.on('message', async (topic, message) => {
            console.log('Received message on topic:', topic);
            console.log('Message:', message.toString());

            try {
                await mongo.save(topic, message.toString());
                console.log('Message saved successfully');
            } catch (error) {
                console.log('Errore in scrittura:', error);
            }
        });
        
        this.flag = true;
    }
}