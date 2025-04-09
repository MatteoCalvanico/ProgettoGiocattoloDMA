FROM node:23-alpine

# Crea la cartella, copia prima i file necessari a node per scaricare i pacchetti e poi tutto il resto
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .

# Porta per il reader
EXPOSE 8080

# 'concurrently' li fa partire insieme
CMD ["concurrently", "npm run sub", "npm run api"]