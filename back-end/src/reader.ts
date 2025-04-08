import mongoose from "mongoose";
import { Message } from "./model/schema";

const express = require('express')
const app = express()
const port = 8080

// Connessione a MongoDB con Mongoose
const mongoUrl = "mongodb://localhost:27017/projectOne";
mongoose.connect(mongoUrl)
  .then(() => console.log('Connection to MongoDB succedes'))
  .catch(err => console.error('Errore di connessione a MongoDB:', err));


// Tutti i messaggi
app.get('/', async (req, res) => {
    try {
        const messages = await Message.find({});
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})