import React, { useState } from 'react';
import './App.css';
import mqtt from 'mqtt';

function App() {
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnesso');
  const [messageStatus, setMessageStatus] = useState('');

  function sendData() {
    console.log('Button clicked');

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