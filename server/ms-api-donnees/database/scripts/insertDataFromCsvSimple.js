// Importation des modules nécessaires
import dotenv from 'dotenv'; // Module pour charger les variables d'environnement à partir d'un fichier .env
import fs from 'fs'; // Module pour lire les fichiers
import pkg from 'pg'; // Package PostgreSQL

const { Pool } = pkg; // Utilisation de la classe Pool à partir du package pg pour gérer les connexions à la base de données PostgreSQL

// Récupération des variables d'environnement à partir du fichier .env
dotenv.config();

// Création d'une instance du pool de connexions PostgreSQL en utilisant les variables d'environnement
const pool = new Pool({
    user: process.env.PGUSER, // Utilisation des variables d'environnement pour la configuration de la base de données
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

/**
 * Fonction pour insérer des données à partir des fichiers CSV dans la base de données
 * @param {string} folderPath - Chemin du dossier contenant les fichiers CSV
 * @param {string} commandeSQL - Commande SQL pour insérer les données dans la base de données
 * @param {number} numberColumns - Nombre de colonnes dans le fichier CSV
 */
async function insertDataFromCsv(folderPath, commandeSQL, numberColumns) {

    // Retourne une promesse pour gérer de manière asynchrone l'opération
    return new Promise((resolve, reject) => {
        // Lecture du dossier contenant les fichiers CSV
        fs.readdir(folderPath, 'utf8', async (error, files) => {
            if (error) {
                console.log('Erreur lors de la lecture du dossier: ', error);
                reject(error); // Rejette la promesse en cas d'erreur
                return;
            }

            // Mappe chaque fichier pour effectuer des opérations asynchrones sur chaque fichier
            const promises = files.map(async (file) => {
                const filePath = `${folderPath}/${file}`;
                try {
                    // Lecture du contenu du fichier CSV
                    const fileContents = await fs.promises.readFile(filePath, 'utf8');
                    // Séparation des lignes du fichier CSV et suppression des retours chariots
                    const lines = fileContents.split('\n').map(line => line.replace(/\r$/, ''));
                    // Connexion à la base de données
                    const client = await pool.connect();

                    // Parcours des lignes du fichier CSV à partir de la deuxième ligne (index 1)
                    for (let i = 1; i < lines.length; i++) {
                        // Séparation des colonnes de chaque ligne du fichier CSV
                        const columns = lines[i].split(';');

                        // Vérification si la ligne a suffisamment de colonnes
                        if (columns.length >= numberColumns) {
                            // Sélection des colonnes nécessaires (jusqu'à numberColumns)
                            const values = columns.slice(0, numberColumns);

                            // Vérification des valeurs et remplacement des valeurs spécifiques par null
                            for (let j = 0; j < values.length; j++) {
                                if (values[j].includes('N/A') || values[j].trim() === '' || values[j] === '-') {
                                    values[j] = null;
                                }

                                // Remplacement des virgules par des points pour les nombres décimaux
                                if (values[j] && values[j].includes(',')) {
                                    values[j] = values[j].replace(',', '.');
                                }
                            }

                            // Insertion sécurisée des données dans la table de la base de données
                            try {
                                await client.query(commandeSQL, values); // Exécution de la commande SQL avec les valeurs
                            } catch (error) {
                                console.log('Erreur lors de l\'insertion des données: ', error);
                            }
                        }
                    }

                    client.release(); // Libération de la connexion à la base de données
                } catch (error) {
                    console.log('Erreur lors de l\'insertion des données: ', error);
                }
            });

            // Attente de l'achèvement de toutes les opérations asynchrones
            Promise.all(promises)
                .then(() => {
                    console.log('Tous les fichiers ont été traités avec succès.');
                    resolve(); // Résolution de la promesse en cas de succès
                })
                .catch((error) => {
                    console.log('Erreur lors du traitement des fichiers: ', error);
                    reject(error); // Rejette la promesse en cas d'erreur
                });
        });
    });
}

// Exportation de la fonction pour être utilisée dans d'autres fichiers
export default insertDataFromCsv;
