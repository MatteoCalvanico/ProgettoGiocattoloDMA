FROM node:23-alpine

# Crea la cartella, copia prima i file necessari a node per scaricare i pacchetti e poi tutto il resto
WORKDIR /usr/src/fe
COPY package*.json ./
RUN npm i
COPY . .

# Porta per il front-end e facciamo partire l'applicazione React
EXPOSE 3000
CMD ["npm run start"]