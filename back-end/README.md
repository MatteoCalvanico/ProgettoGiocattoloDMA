Scarica le dipendenze con "npm i", successivamente è possibile:
- far startare il subscriber fare: "npm run sub".
- far startare il reader che espone le api fare: "npm run api".

Per creare un'immagine Docker per containerizzare il tutto fare:
```sh
docker build -t backend .
```