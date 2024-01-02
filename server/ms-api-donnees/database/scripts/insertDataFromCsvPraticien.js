// Importation des modules nécessaires
import dotenv from 'dotenv';
import fs from 'fs';
import pkg from 'pg';

const { Pool } = pkg;

// Configuration des variables d'environnement
dotenv.config();

// Création d'une instance du pool de connexions PostgreSQL
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

/**
 * Fonction pour insérer des données à partir des fichiers CSV dans la base de données
 * @param {string} folderPath - Chemin du dossier contenant les fichiers CSV
 * @param {number} numberColumns - Nombre de colonnes dans le fichier CSV
 */
async function insertDataFromCsvPraticien(folderPath, numberColumns) {

    // Retourne une promesse pour gérer de manière asynchrone l'opération
    return new Promise((resolve, reject) => {
        // Lecture du dossier contenant les fichiers CSV
        fs.readdir(folderPath, 'utf8', async (error, files) => {
            if (error) {
                console.log('Erreur lors de la lecture du dossier: ', error);
                reject(error);
                return;
            }

            // Mappe chaque fichier pour effectuer des opérations asynchrones sur chaque fichier
            const promises = files.map(async (file) => {
                const filePath = `${folderPath}/${file}`;
                try {
                    // Lecture du contenu du fichier CSV
                    const fileContents = await fs.promises.readFile(filePath, 'utf8');
                    // Séparation des lignes du fichier CSV
                    const lines = fileContents.split('\n').map(line => line.replace(/\r$/, ''));

                    // Connexion à la base de données
                    const client = await pool.connect();

                    // La première ligne contient les catégories
                    const categories = lines[0].split(';').map(category => category.trim());

                    // Commencer à partir de la deuxième ligne pour lire les données
                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(';');

                        // Vérifier si la ligne a suffisamment de colonnes
                        if (values.length >= numberColumns) {
                            const idPraticien = values[0];
                            const idCommune = values[1];

                            // Parcourir les colonnes supplémentaires
                            for (let j = 2; j < values.length; j++) {
                                const categorie = categories[j]; // La catégorie correspond à l'index dans le tableau des catégories
                                const valeur = values[j].trim();

                                // Requête d'insertion des données dans la table PRATICIEN_COMMUNE
                                const insertData = `INSERT INTO PRATICIEN_COMMUNE (id_code_praticien, id_code_commune, categorie, valeur) VALUES ($1, $2, $3, $4);`;

                                try {
                                    // Exécution de la requête d'insertion
                                    await client.query(insertData, [idPraticien, idCommune, categorie, valeur]);
                                } catch (error) {
                                    console.log('Erreur lors de l\'insertion des données: ', error);
                                }
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
                    resolve();
                })
                .catch((error) => {
                    console.log('Erreur lors du traitement des fichiers: ', error);
                    reject(error);
                });
        });
    });
}

// Exportation de la fonction pour être utilisée dans d'autres fichiers
export default insertDataFromCsvPraticien;
