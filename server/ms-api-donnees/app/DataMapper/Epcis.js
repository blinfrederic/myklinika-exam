// Importe la classe 'Database' depuis le fichier 'database.js'
import Database from "./database.js";

// Définition de la classe 'Epcis' qui gère les opérations liées aux EPCIs dans la base de données
class Epcis {

    // Fonction statique asynchrone pour récupérer tous les EPCIs avec pagination
    static async getAllEpcis(pageNumber) {
        // Définit la taille de la page et le décalage pour la pagination
        const pageSize = 100;
        const offset = (pageNumber - 1) * pageSize;
        // Crée une instance de la classe 'Database'
        const db = new Database();

        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécute la requête SQL pour récupérer les EPCIs avec les catégories associées
            const result = await db.query(`
                SELECT T3.*,                                            
                JSON_AGG(json_build_object(
                    'id_categorie_epci', T1.id_categorie_epci,
                    'libelle', T1.libelle,
                    'valeur', T2.valeur
                )) AS categories 
                FROM categorie_epci AS T1
                INNER JOIN categorie_has_epci AS T2 ON T1.id_categorie_epci = T2.id_categorie_epci
                INNER JOIN epci AS T3 ON T2.id_code_epci = T3.id_code_epci                                        
                GROUP BY T3.id_code_epci
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

    // Fonction statique asynchrone pour récupérer tous les EPCIs par libellé de catégorie
    static async getAllEpcisByLibelle(libelle) {
        // Crée une instance de la classe 'Database'
        const db = new Database();
        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécute la requête SQL pour récupérer les EPCIs par libellé de catégorie
            const result = await db.query(`
                SELECT T3.id_code_epci, T1.libelle, T2.valeur
                FROM categorie_epci AS T1
                INNER JOIN categorie_has_epci AS T2 ON T1.id_categorie_epci = T2.id_categorie_epci
                INNER JOIN epci AS T3 ON T2.id_code_epci = T3.id_code_epci
                WHERE T1.libelle = $1
                GROUP BY T3.id_code_epci, T1.libelle, T2.valeur;
            `, [libelle]);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Fonction statique asynchrone pour récupérer un EPCI par son code EPCI
    static async getEpciByCodeEpci(codeEpci) {
        // Crée une instance de la classe 'Database'
        const db = new Database();
        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");
            // Exécute la requête SQL pour récupérer un EPCI par son code EPCI
            const result = await db.query(`
                SELECT T3.*,
                JSON_AGG(json_build_object(
                    'id_categorie_epci', T1.id_categorie_epci,
                    'libelle', T1.libelle,
                    'valeur', T2.valeur
                )) AS categories
                FROM categorie_epci AS T1
                INNER JOIN categorie_has_epci AS T2 ON T1.id_categorie_epci = T2.id_categorie_epci
                INNER JOIN epci AS T3 ON T2.id_code_epci = T3.id_code_epci
                WHERE T3.id_code_epci = $1
                GROUP BY T3.id_code_epci;
            `, [codeEpci]);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Fonction statique asynchrone pour récupérer un EPCI par son code EPCI et libellé de catégorie
    static async getEpciByCodeEpciAndLibelle(codeEpci, libelle) {
        // Crée une instance de la classe 'Database'
        const db = new Database();
        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");
            // Exécute la requête SQL pour récupérer un EPCI par son code EPCI et libellé de catégorie
            const result = await db.query(`
                SELECT T3.*,
                JSON_AGG(json_build_object(
                    'libelle', T1.libelle,
                    'valeur', T2.valeur
                )) AS categories
                FROM categorie_epci AS T1
                INNER JOIN categorie_has_epci AS T2 ON T1.id_categorie_epci = T2.id_categorie_epci
                INNER JOIN epci AS T3 ON T2.id_code_epci = T3.id_code_epci
                WHERE T3.id_code_epci = $1 AND T1.libelle = $2
                GROUP BY T3.id_code_epci;
            `, [codeEpci, libelle]);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Fonction statique asynchrone pour récupérer toutes les communes par nom d'EPCI
    static async getAllCommunesByEpci(epciName) {
        // Crée une instance de la classe 'Database'
        const db = new Database();
        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécute la requête SQL pour récupérer toutes les communes par nom d'EPCI
            const result = await db.query(`
                SELECT 
                T1.id_code_epci,
                T1.nom_epci,
                JSON_AGG(json_build_object(
                    'code_commune', T3.id_code_commune,
                    'nom_commune', T3.nom_commune
                )) AS communes
                FROM 
                epci AS T1
                INNER JOIN 
                commune AS T3 ON T1.id_code_epci = T3.id_code_epci
                WHERE 
                T1.nom_epci = $1
                GROUP BY 
                T1.id_code_epci, T1.nom_epci;
            `, [epciName]);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Fonction statique asynchrone pour récupérer la liste de tous les libellés des catégories d'EPCIs
    static async getAllEpcisList() {
        // Crée une instance de la classe 'Database'
        const db = new Database();
        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécute la requête SQL pour récupérer la liste de tous les libellés des catégories d'EPCIs
            const result = await db.query(`
                SELECT libelle 
                FROM categorie_epci
            `);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Fonction statique asynchrone pour récupérer tous les EPCIs par libellé et catégorie spécifiques
    static async getAllEpcisByLibelleAndCategory(libelle, categorie) {
        // Crée une instance de la classe 'Database'
        const db = new Database();
        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécute la requête SQL pour récupérer tous les EPCIs par libellé et catégorie spécifiques
            const result = await db.query(`
                SELECT 
                T1.id_code_epci,
                T1.nom_epci,
                population.valeur AS population,
                JSON_AGG(json_build_object(
                    'code_commune', T3.id_code_commune,
                    'nom_commune', T3.nom_commune,
                    'categorie', T4.categorie,
                    'valeur', T4.valeur
                )) AS communes
                FROM 
                epci AS T1
                INNER JOIN 
                commune AS T3 ON T1.id_code_epci = T3.id_code_epci
                INNER JOIN 
                (
                    SELECT * FROM categorie_epci
                    INNER JOIN
                    categorie_has_epci ON categorie_epci.id_categorie_epci = categorie_has_epci.id_categorie_epci
                    WHERE libelle = 'population'
                ) AS population ON T1.id_code_epci = population.id_code_epci
                INNER JOIN 
                praticien_commune AS T4 ON T3.id_code_commune = T4.id_code_commune
                INNER JOIN
                praticien AS T5 ON T4.id_code_praticien = T5.id_code_praticien
                WHERE 
                T5.libelle = $1 AND T4.categorie = $2
                GROUP BY 
                T1.id_code_epci, T1.nom_epci, population;
            `, [libelle, categorie]);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Fonction statique asynchrone pour récupérer les communes par EPCI et libellé de catégorie spécifiques
    static async getCommunesByEpciAndLibelle(codeEpci, libelle) {
        // Crée une instance de la classe 'Database'
        const db = new Database();
        try {
            // Se connecte à la base de données
            await db.connect();
            console.log("Connecté à la base de données");
            // Exécute la requête SQL pour récupérer les communes par EPCI et libellé de catégorie spécifiques
            const result = await db.query(`
                SELECT 
                T1.id_code_epci,
                T1.nom_epci,
                JSON_AGG(json_build_object(
                    'nom_commune', T2.nom_commune,
                    'categorie', T3.libelle,
                    'valeur', T4.valeur
                )) AS communes
                FROM epci AS T1
                INNER JOIN commune AS T2 ON T1.id_code_epci = T2.id_code_epci
                INNER JOIN categorie_has_commune AS T4 ON T2.id_code_commune = T4.id_code_commune
                INNER JOIN categorie_commune AS T3 ON T4.id_categorie_commune = T3.id_categorie_commune
                WHERE T1.id_code_epci = $1 AND T3.libelle = $2
                GROUP BY T1.id_code_epci, T1.nom_epci;
            `, [codeEpci, libelle]);

            // Retourne le résultat de la requête
            return result;
        } finally {
            // Ferme la connexion à la base de données, même en cas d'erreur
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }
}

// Exporte la classe 'Epcis' pour qu'elle puisse être utilisée dans d'autres fichiers
export default Epcis;
