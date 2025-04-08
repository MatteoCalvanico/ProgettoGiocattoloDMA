import mqtt from "mqtt";
import mongoose from "mongoose";
import { Message } from "./model/schema";


// Configurazione per il broker Mosquitto
const host = 'localhost';
const port = '9001';      // WebSocket
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `ws://${host}:${port}`;

// Configurazione per il DB Mongo
const mongoUrl = "mongodb://localhost:27017/projectOne";


// Connessione a MongoDB con Mongoose
mongoose.connect(mongoUrl)
  .then(() => console.log('Connection to MongoDB succedes'))
  .catch(err => console.error('Errore di connessione a MongoDB:', err));

// Connsessione a Mosquitto con MQTT.js
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  // Nessun username/password necessario (allow_anonymous true)
  reconnectPeriod: 1000,
});

console.log("Connection...")
client.on('connect', function() {
    client.subscribe('projectOneData', function(err) {
        if (!err) {
            console.log("Subscribed to 'projectOneData'");
        }
    });
});


// Legge continuamente da subscriber e salva in MongoDB
client.on('message', async function(topic, message) {
    console.log('Received message on topic:', topic);
    console.log('Message:', message.toString());

    try {
        const newMsg = new Message({
            topic: topic,
            payload: message.toString()
        });

        await newMsg.save();
    } catch (error) {
        console.log('Errore in scrittura:', error)
    }
});