# ProgettoGiocattoloDMA
First "Toy Project" made in DMA for my internship

## Startup
With Docker Compose you just have to use this command:
``` sh
docker compose up
```
Obviously you will need Docker installed on your device.

## Context
This project aims to simulate a full stack application with a level architecture back end and a React front end. Everything packed with Docker Compose

## Technology used
- React: used for the front end.
- Mosquitto: used as a mqtt broker.
- MongoDB: used to save messages shared with mqtt.
- Kong Gateway: used as a gateway.

### Used Lib
- Mongoose: used for MongoDB interactions.
- Fortification: used for endpoints.
- Mqtt.js: used for Mosquitto interactions.