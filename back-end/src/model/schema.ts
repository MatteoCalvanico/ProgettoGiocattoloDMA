import mongoose from "mongoose";

// Definizione dello schema per i messaggi MQTT
const messageSchema = new mongoose.Schema({
  topic: String,
  payload: String,
  timestamp: { type: Date, default: Date.now }
});

// Creazione del modello
export const Message = mongoose.model('Message', messageSchema);