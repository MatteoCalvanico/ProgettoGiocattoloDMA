import mongoose from "mongoose";

// Definizione dello schema per i messaggi MQTT
const messageSchema = new mongoose.Schema({
  topic: String,
  payload: String,
  timestamp: { type: Date, default: Date.now },
});

const messageSchemaSeries = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    metadata: { topic: String, payload: String },
  },
  {
    timeseries: {
      timeField: "timestamp",
      metaField: "metadata",
      granularity: "seconds",
    },
  }
);

// Export del modello
export const Message = mongoose.model("Message", messageSchema);
export const MessageSeries = mongoose.model(
  "Message_series",
  messageSchemaSeries
);
