// Questa classe servirà per la gestione di MongoDB
import mongoose from "mongoose";
import { Message, MessageSeries } from "../model/schema";

export class mongoRepo {
  constructor() {
    mongoose
      .connect(process.env.MONGO_URL || "mongodb://localhost:27017/projectOne")
      .then(() => console.log("Connection to MongoDB succedes"))
      .catch((err) => console.error("Errore di connessione a MongoDB:", err));
  }

  async save({ topic, payload }: { topic: string; payload: string }) {
    const newMsg = new Message({
      topic: topic,
      payload: payload,
    });

    await newMsg.save();
  }

  async saveSeries({ topic, payload }: { topic: string; payload: string }) {
    const newSeries = new MessageSeries({
      metadata: { topic, payload },
    });

    await newSeries.save();
  }

  /**
   * Trova i valori all'interno del db
   * @param param Parametri su cui cercare, lasciare null se si necessità di ottenere tutti i messaggi
   */
  async find(param?: Object) {
    console.log("Searching...");
    if (param == null) {
      const results = await Message.find({});
      console.log("Find");
      return results;
    }
    const results = await Message.find(param);
    console.log("Find");
    return results;
  }

  async findByTimestamp(stamp: string) {
    console.log("Searching...");
    const results = await Message.find({ timestamp: stamp });
    console.log("Find");
    return results;
  }

  async findSeries(param?: Object) {
    console.log("Searching...");
    if (param == null) {
      const results = await MessageSeries.find({});
      console.log("Find");
      return results;
    }
    const results = await MessageSeries.find(param);
    return results;
  }

  async findSeriesByTimestamp(stamp: string) {
    console.log("Searching...");
    const results = await MessageSeries.find({ timestamp: stamp });
    console.log("Find");
    return results;
  }
}
