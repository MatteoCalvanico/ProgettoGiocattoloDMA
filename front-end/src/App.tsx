import React, { useState } from 'react';
import './App.css';
import mqtt from 'mqtt';

function App() {
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnesso');
  const [messageStatus, setMessageStatus] = useState('');

  function sendData() {
    // Configurazione per il broker RabbitMQ locale
    const host = process.env.REACT_APP_MQTT_HOST || 'localhost';
    const port = process.env.REACT_APP_MQTT_PORT || '15675';
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    const connectUrl = `ws://${host}:${port}/ws`;

    const client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      // Use consistent environment variables
      username: process.env.REACT_APP_RABBITMQ_USER || 'guest',
      password: process.env.REACT_APP_RABBITMQ_PASSWORD || 'guest',
      reconnectPeriod: 1000,
    });
    
    setConnectionStatus('Connessione in corso...');
    
    client.on('connect', () => {
      console.log('Connected');
      setConnectionStatus('Connesso');
      
      // Pubblica il messaggio inserito dall'utente
      client.publish('projectOneData', message || 'messaggio predefinito', { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error('Publish error:', error);
          setMessageStatus('Errore nella pubblicazione: ' + error.message);
        } else {
          console.log("Message published successfully to topic 'projectOneData'");
          setMessageStatus('Messaggio pubblicato con successo!');
          client.end();
          console.log("Disconnected");
        }
      });
    });

    client.on('error', (err) => {
      console.log('Connection error: ', err);
      setConnectionStatus('Errore di connessione: ' + err.message);
      client.end();
    });

    client.on('reconnect', () => {
      console.log('Reconnecting...');
      setConnectionStatus('Riconnessione in corso...');
    });
  }

  return (
    <div className="App">
      <h2>Client MQTT React</h2>
      <div className="status-container">
        <p>Stato: <span className={connectionStatus === 'Connesso' ? 'connected' : 'disconnected'}>{connectionStatus}</span></p>
        {messageStatus && <p className="message-status">{messageStatus}</p>}
      </div>
      <div className="input-container">
        <input 
          type='text' 
          placeholder='Testo da inviare...' 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendData}>Invia messaggio</button>
      </div>
    </div>
  );
}

export default App;