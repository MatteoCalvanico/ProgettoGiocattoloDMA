// Questa classe servirà per la gestione di tutto ciò che riguarda mongo

import mongoose from "mongoose";
import { Message } from "../model/schema";

export class MongoRepo {
    url: string;

    constructor(mongoUrl: string) {
        this.url = mongoUrl;
    }

    connection() {
        mongoose.connect(this.url)
            .then(() => console.log('Connection to MongoDB succedes'))
            .catch(err => console.error('Errore di connessione a MongoDB:', err));
    }

    async save(topic: string, payload: string) {
        const newMsg = new Message({
            topic: topic,
            payload: payload
        });

        await newMsg.save();
    }

    /**
     * Trova i valori all'interno del db
     * @param param Parametri su cui cercare, lasciare null se si necessità di ottenere tutti i messaggi
     */
    async find(param: Object) {
        console.log('Searching...')
        if (param == null) {
            const results = await Message.find({});
            console.log('Find');
            return results;
        }
        const results = await Message.find(param);
        console.log('Find');
        return results;
    }
}