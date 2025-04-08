import mqtt from "mqtt";


// Configurazione per il broker Mosquitto locale
const host = 'localhost';
const port = '9001';      // WebSocket
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `ws://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  // Nessun username/password necessario (allow_anonymous true)
  reconnectPeriod: 1000,
});

console.log("Connessione in corso...")
client.on('connect', function() {
    client.subscribe('projectOneData', function(err) {
        if (!err) {
            console.log("Subscribed to 'projectOneData'");
        }
    });
});

// Continua a leggere da subscriber
client.on('message', function(topic, message) {
    console.log('Received message on topic:', topic);
    console.log('Message:', message.toString());
});