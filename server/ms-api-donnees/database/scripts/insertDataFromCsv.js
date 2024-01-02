// Importez les dépendances nécessaires
import dotenv from 'dotenv'; // Pour la configuration des variables d'environnement
import fs from 'fs'; // Pour la gestion des fichiers
import pkg from 'pg'; // Pour la communication avec PostgreSQL

// Extrayez la classe Pool de l'objet pkg (package PostgreSQL)
const { Pool } = pkg;

// Chargez les variables d'environnement à partir d'un fichier .env
dotenv.config();

// Créez une instance de Pool pour gérer les connexions à la base de données PostgreSQL
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
});

/**
 * Insérez les données à partir de fichiers CSV dans la base de données
 * @param {string} folderPath Chemin du dossier contenant les fichiers CSV
 * @param {number} numberColumnsPush Quel colonne on veut push dans la table sachant que la premiere colonne est 0
 * @param {number} numberColumns Specifiez le nombre de colonne dans le fichier
 * @param {number} referenceColumn Specifiez la colonne de reference (code epci, code commune, code praticien) sachant que la premiere colonne est 0
 * @param {number} ignoredColumnIndex Specifiez la colonne à ignorer sachant que la premiere colonne est 0
 * @param {string} type Specifiez le type de données (epci, commune, praticien)
 */
async function insertDataFromCsv(folderPath, selectCheck, insertCategorie, insertData, numberColumnsPush, numberColumns, referenceColumn, type) {

    try {
        // Lisez la liste des fichiers dans le répertoire spécifié
        const files = await fs.promises.readdir(folderPath, 'utf8');

        // Parcourez chaque fichier
        for (const file of files) {
            const filePath = `${folderPath}/${file}`;

            // Insérez les données de catégorie depuis le fichier
            await insertDataCategorie(filePath, selectCheck, insertCategorie, numberColumnsPush, numberColumns, referenceColumn, type);

            // Insérez les données spécifiques depuis le fichier
            await insertDataDonnees(filePath, selectCheck, insertData, numberColumnsPush, numberColumns, referenceColumn, type);
        }

    } catch (error) {
        console.log('Erreur lors du traitement des fichiers: ', error);
    }

}

// Fonction pour insérer les données de catégorie depuis un fichier CSV
async function insertDataCategorie(filePath, selectCheck, insertCategorie, numberColumnsPush, numberColumns, referenceColumn, type) {
    try {
        // Lisez le contenu du fichier CSV
        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        // Divisez le contenu en lignes et supprimez les retours chariot en fin de ligne
        const lines = fileContents.split('\n').map(line => line.replace(/\r$/, ''));
        // Établissez une connexion client à la base de données PostgreSQL
        const client = await pool.connect();
        let data = [];

        // Parcourez chaque ligne du fichier CSV
        for (let i = 0; i < lines.length; i++) {
            const columns = lines[i].split(';');

            // Vérifiez s'il y a le nombre de colonnes attendu dans la ligne
            if (columns.length >= numberColumns) {
                const values = columns.slice(0, numberColumns);

                // Récupérez les valeurs des colonnes 
                const columnIndex1 = referenceColumn; // Indice de la colonne ou il y a le code de reference
                const columnIndex2 = numberColumnsPush; // Quel colonne on veut push dans la table

                const value1 = values[columnIndex1];
                const value2 = values[columnIndex2];

                const columnValues = [value1, value2];

                data.push(columnValues);

                // Si c'est la première ligne (ligne d'en-tête), traitez les données de catégorie
                if (i === 0) {
                    const ligne1 = columnValues;

                    const libelleCategorie = ligne1[1]; // Récupérez le libellé de la catégorie depuis les données


                    // Vérifiez si la catégorie existe déjà en base de données
                    const checkCategoryQuery = selectCheck;
                    const checkCategoryValues = [libelleCategorie];

                    try {
                        const checkResult = await client.query(checkCategoryQuery, checkCategoryValues);
                        if (checkResult.rows.length === 0) {
                            // La catégorie n'existe pas, insérez-la
                            const insertCategoryQuery = insertCategorie;
                            const insertCategoryValues = [libelleCategorie, 'STRING'];

                            try {
                                const insertResult = await client.query(insertCategoryQuery, insertCategoryValues);
                                console.log('Insertion la catégorie ' + libelleCategorie + ' réussie.');
                            } catch (error) {
                                console.log('Erreur lors de l\'insertion des données de catégorie: ', error);
                            }
                        } else {
                            console.log(`La catégorie ` + libelleCategorie + ` existe déjà en base de données.`);
                        }
                    } catch (error) {
                        console.log('Erreur lors de la recherche de la catégorie: ', error);
                    }
                }
            }
        }

        // Libérez la connexion client PostgreSQL
        client.release();
    } catch (error) {
        console.log('Erreur lors de la lecture du fichier: ', error);
    }
}

// Fonction pour insérer des données spécifiques depuis un fichier CSV
async function insertDataDonnees(filePath, selectCheck, insertData, numberColumnsPush, numberColumns, referenceColumn, type) {
    try {
        // Lisez le contenu du fichier CSV
        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        // Divisez le contenu en lignes et supprimez les retours chariot en fin de ligne
        const lines = fileContents.split('\n').map(line => line.replace(/\r$/, ''));
        // Établissez une connexion client à la base de données PostgreSQL
        const client = await pool.connect();
        let data = [];
        let libelleCategorie = null;
        let idCategorie = null;

        // Parcourez chaque ligne du fichier CSV
        for (let i = 0; i < lines.length; i++) {
            const columns = lines[i].split(';');

            // Vérifiez s'il y a au moins 10 colonnes dans la ligne
            if (columns.length >= numberColumns) {
                const values = columns.slice(0, numberColumns);

                // Récupérez les valeurs des colonnes 1 et 4 (par exemple)
                const columnIndex1 = referenceColumn; // Indice de la colonne ou il y a le code de reference
                const columnIndex2 = numberColumnsPush; // Quel colonne on veut push dans la table

                const value1 = values[columnIndex1];
                let value2 = values[columnIndex2];

                // Vérifiez si value2 est null, et si oui, remplacez-le par "N/A"
                if (value2 === null) {
                    value2 = 'N/A';
                }

                const columnValues = [value1, value2];

                data.push(columnValues);

                // Si c'est la première ligne (ligne d'en-tête), traitez les données de catégorie
                if (i === 0) {
                    const ligne1 = columnValues;

                    libelleCategorie = ligne1[1];
                    const categorieQuery = selectCheck;
                    const recupCategoryValues = [libelleCategorie];
                    const checkResult = await client.query(categorieQuery, recupCategoryValues);
                    idCategorie = checkResult.rows[0]['id_categorie_' + type];
                } else if (value2 !== null) {
                    // Vérifiez si value2 est null, et si oui, remplacez-le par "N/A"
                    if (value2 === null) {
                        value2 = 'N/A';
                    }
                    const insertDonneesQuery = insertData;
                    const valuesDonnees = [idCategorie, value1, value2];
                    try {
                        await client.query(insertDonneesQuery, valuesDonnees);
                    } catch (error) {
                        console.log('Erreur lors de l\'insertion des données de catégorie: ', error);
                    }
                }
            }
        }
        // Libérez la connexion client PostgreSQL
        client.release();
    } catch (error) {
        console.log('Erreur lors de la lecture du fichier: ', error);
    }
}

// Exportez la fonction pour être utilisée dans d'autres fichiers
export default insertDataFromCsv;
