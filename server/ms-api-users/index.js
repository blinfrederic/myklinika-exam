import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import router  from './app/router.js';

dotenv.config();

const port = process.env.PORT || 3003;
const app = express();

// Configuration du middleware pour parser le body des requêtes HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configuration du middleware CORS pour autoriser uniquement l'origine http://localhost:3000
const corsOptions = {
    // ne rien refuser
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization,Content-Type,Origin,X-Requested-With,Accept',
};
app.use(cors(corsOptions));
// app.use(cors());

// Configuration du router
app.use(router);

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur users démarré sur le port ${port}`);
});