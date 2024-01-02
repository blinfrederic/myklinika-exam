// Importation des modules nécessaires
import dotenv from 'dotenv'; // Module pour charger les variables d'environnement depuis .env
import pkg from 'pg'; // Module PostgreSQL
const { Client } = pkg; // Importation de la classe Client depuis pg

dotenv.config(); // Chargement des variables d'environnement depuis .env

// Définition de la classe Database pour interagir avec la base de données
class Database {

    constructor() {
        // Création d'une instance de Client PostgreSQL en utilisant la chaîne de connexion de DATABASE_URL
        this.client = new Client({
            connectionString: process.env.DATABASE_URL,
        });
    }

    // Méthode asynchrone pour établir une connexion à la base de données
    async connect() {
        try {
            await this.client.connect();
        } catch (error) {
            throw error;
        }
    }

    // Méthode asynchrone pour exécuter une requête SQL
    async query(sql, params = []) {
        try {
            const result = await this.client.query(sql, params);
            return result.rows; // Renvoie les lignes de résultat après l'exécution de la requête
        } catch (error) {
            throw error;
        }
    }

    // Méthode asynchrone pour fermer la connexion à la base de données
    async close() {
        try {
            await this.client.end();
        } catch (error) {
            throw error;
        }
    }
}

// Exportation de la classe Database en tant que module par défaut
export default Database;
