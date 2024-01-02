import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './app/router.js';

dotenv.config();

const port = process.env.PORT || 3002;
const app = express();

app.set('view engine', 'ejs');
app.set('views', './app/views');


app.use(express.static('./public'));
// Configuration du middleware CORS
const corsOptions = {
    origin: '*', // Modifier pour spécifier les origines autorisées
};

app.use(cors(corsOptions));

// Configuration du middleware pour parser le body des requêtes HTTP
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration du router
app.use('/api', router); // Vous pouvez ajuster le chemin de la route

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur donnees démarré sur le port ${port}`);
});