Scarica le dipendenze con "npm i", successivamente è possibile:
- far startare il subscriber per leggere da broker e salvare su mongo: "npm run sub".
- far startare l'applicazione principale con gli endpoint che espone le api fare: "npm run app".

Per creare un'immagine Docker per containerizzare il tutto fare:
```sh
docker build -t backend .
```