// Importe la classe 'Database' depuis le fichier 'database.js'
import Database from "./database.js";

// Définition de la classe 'Communes' qui gère les opérations liées aux communes dans la base de données
class Communes {

    // Fonction statique asynchrone pour récupérer toutes les communes avec pagination
    static async getAllCommunes(pageNumber) {
        // Définit la taille de la page et le décalage pour la pagination
        const pageSize = 350;
        const offset = (pageNumber - 1) * pageSize;

        // Crée une instance de la classe 'Database'
        const db = new Database();

        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécute la requête SQL pour récupérer les communes avec les catégories associées
            const result = await db.query(`
                SELECT T3.*,
                JSON_AGG(json_build_object(
                    'id_categorie_commune', T1.id_categorie_commune,
                    'libelle', T1.libelle,
                    'valeur', T2.valeur
                )) AS categories
                FROM categorie_commune AS T1
                INNER JOIN categorie_has_commune AS T2 ON T1.id_categorie_commune = T2.id_categorie_commune
                INNER JOIN commune AS T3 ON T2.id_code_commune = T3.id_code_commune
                GROUP BY T3.id_code_commune
                LIMIT $1 OFFSET $2;
            `, [pageSize, offset]);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Fonction statique asynchrone pour récupérer une commune par son nom et son libellé de catégorie
    static async getCommuneByName(communeName, libelle) {
        // Crée une instance de la classe 'Database'
        const db = new Database();

        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécute la requête SQL pour récupérer une commune spécifique avec les catégories associées
            const result = await db.query(`
                SELECT T3.*,
                JSON_AGG(json_build_object(
                    'libelle', T1.libelle,
                    'valeur', T2.valeur
                )) AS categories
                FROM categorie_commune AS T1
                INNER JOIN categorie_has_commune AS T2 ON T1.id_categorie_commune = T2.id_categorie_commune
                INNER JOIN commune AS T3 ON T2.id_code_commune = T3.id_code_commune
                WHERE T3.nom_commune = $1 AND T1.libelle = $2
                GROUP BY T3.id_code_commune;
            `, [communeName, libelle]);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }
}

// Exporte la classe 'Communes' pour qu'elle puisse être utilisée dans d'autres fichiers
export default Communes;
