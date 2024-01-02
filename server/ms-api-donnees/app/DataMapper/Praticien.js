// Importe la classe Database depuis le fichier database.js
import Database from "./database.js";

// Définition de la classe Praticiens
class Praticiens {

    // Méthode statique asynchrone pour obtenir des praticiens par commune
    static async getPraticienByCommune(praticienCommune) {
        // Création d'une instance de la classe Database
        const db = new Database();
        try {
            // Connexion à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécution de la requête SQL pour récupérer les praticiens par commune
            const result = await db.query(`
                SELECT 
                    T3.nom_commune, -- Sélectionne le nom de la commune
                    JSON_AGG(json_build_object( -- Agrège les données au format JSON
                        'id_code_praticien', T1.id_code_praticien, -- ID du praticien 
                        'specialite', T1.libelle, -- Spécialité du praticien
                        'valeurs', jsonb_build_object( -- Construit un objet JSON avec les valeurs suivantes
                            'nombre', pc_nombre.valeur, -- Nombre de praticiens dans la commune
                            'evolution_sur_5_ans', pc_evolution.valeur, -- Évolution sur 5 ans
                            'apl', pc_apl.valeur -- APL (Aide Personnalisée au Logement)
                        )
                    ) ORDER BY T1.id_code_praticien) AS praticiens -- Ordonne les praticiens par ID
                FROM
                    praticien AS T1 -- Sélectionne la table "praticien" et l'alias T1
                INNER JOIN
                    (
                        SELECT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'nombre'
                    ) AS pc_nombre ON pc_nombre.id_code_praticien = T1.id_code_praticien -- Effectue une jointure avec la table "praticien_commune" pour les nombres de praticiens
                INNER JOIN
                    (
                        SELECT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'evolution_sur_5_ans'
                    ) AS pc_evolution ON pc_evolution.id_code_praticien = T1.id_code_praticien AND pc_evolution.id_code_commune = pc_nombre.id_code_commune -- Effectue une jointure avec la table "praticien_commune" pour l'évolution sur 5 ans
                INNER JOIN
                    (
                        SELECT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'apl'
                    ) AS pc_apl ON pc_apl.id_code_praticien = T1.id_code_praticien AND pc_apl.id_code_commune = pc_nombre.id_code_commune -- Effectue une jointure avec la table "praticien_commune" pour l'APL
                INNER JOIN
                    commune AS T3 ON pc_nombre.id_code_commune = T3.id_code_commune -- Effectue une jointure avec la table "commune" pour obtenir le nom de la commune
                WHERE
                    T3.nom_commune = $1 -- Filtre les résultats en fonction du nom de la commune passé en paramètre
                GROUP BY
                    T3.nom_commune; -- Groupe les résultats par nom de commune
            `, [praticienCommune]);

            // Retourner le résultat de la requête
            return result;
        } finally {
            // Fermeture de la connexion à la base de données
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Méthode statique asynchrone pour obtenir des praticiens par commune et spécialité
    static async getPraticienSpecialiteByCommune(praticienCommune, praticienSpecialite) {
        // Création d'une instance de la classe Database
        const db = new Database();
        try {
            // Connexion à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécution de la requête SQL pour récupérer les praticiens par commune et spécialité
            const result = await db.query(`
                SELECT
                    T3.nom_commune,
                    JSON_AGG(json_build_object(
                        'id_code_praticien', T1.id_code_praticien,
                        'specialite', T1.libelle,
                        'valeurs', jsonb_build_object(
                            'nombre', pc_nombre.valeur,
                            'evolution_sur_5_ans', pc_evolution.valeur,
                            'apl', pc_apl.valeur
                        )
                    ) ORDER BY T1.id_code_praticien) AS praticiens
                FROM
                    praticien AS T1
                INNER JOIN
                    (
                        SELECT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'nombre'
                    ) AS pc_nombre ON pc_nombre.id_code_praticien = T1.id_code_praticien
                INNER JOIN
                    (
                        SELECT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'evolution_sur_5_ans'
                    ) AS pc_evolution ON pc_evolution.id_code_praticien = T1.id_code_praticien AND pc_evolution.id_code_commune = pc_nombre.id_code_commune
                INNER JOIN
                    (
                        SELECT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'apl'
                    ) AS pc_apl ON pc_apl.id_code_praticien = T1.id_code_praticien AND pc_apl.id_code_commune = pc_nombre.id_code_commune
                INNER JOIN
                    commune AS T3 ON pc_nombre.id_code_commune = T3.id_code_commune
                WHERE
                    T3.nom_commune = $1 AND T1.libelle = $2
                GROUP BY
                    T3.nom_commune; -- Groupe les résultats par nom de commune
            `, [praticienCommune, praticienSpecialite]);

            // Retourner le résultat de la requête
            return result;
        } finally {
            // Fermeture de la connexion à la base de données
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Méthode statique asynchrone pour obtenir tous les praticiens par EPCI
    static async getAllPraticiensByEpci(praticienEpciName) {
        // Création d'une instance de la classe Database
        const db = new Database();
        try {
            // Connexion à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécution de la requête SQL pour récupérer tous les praticiens par EPCI
            const result = await db.query(`
                SELECT 
                    T4.nom_epci,
                    JSON_AGG(json_build_object(
                        'ville', T3.nom_commune,
                        'id_code_praticien', T1.id_code_praticien,
                        'specialite', T1.libelle,
                        'valeurs', jsonb_build_object(
                            'nombre', pc_nombre.valeur,
                            'evolution_sur_5_ans', pc_evolution.valeur,
                            'apl', pc_apl.valeur
                        )
                    ) ORDER BY T1.id_code_praticien) AS praticiens
                FROM
                    praticien AS T1
                INNER JOIN
                    (
                        SELECT DISTINCT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'nombre'
                    ) AS pc_nombre ON pc_nombre.id_code_praticien = T1.id_code_praticien
                INNER JOIN
                    (
                        SELECT DISTINCT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'evolution_sur_5_ans'
                    ) AS pc_evolution ON pc_evolution.id_code_praticien = T1.id_code_praticien AND pc_evolution.id_code_commune = pc_nombre.id_code_commune
                INNER JOIN
                    (
                        SELECT DISTINCT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'apl'
                    ) AS pc_apl ON pc_apl.id_code_praticien = T1.id_code_praticien AND pc_apl.id_code_commune = pc_nombre.id_code_commune
                INNER JOIN
                    commune AS T3 ON pc_nombre.id_code_commune = T3.id_code_commune
                INNER JOIN 
                    epci AS T4 ON T4.id_code_epci = T3.id_code_epci
                WHERE
                    T4.nom_epci = $1
                GROUP BY
                    T4.nom_epci; -- Groupe les résultats par nom d'EPCI
            `, [praticienEpciName]);

            // Retourner le résultat de la requête
            return result;
        } finally {
            // Fermeture de la connexion à la base de données
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Méthode statique asynchrone pour obtenir des praticiens par EPCI et spécialité
    static async getPraticienByEpci(praticienEpciName, praticienSpecialite) {
        // Création d'une instance de la classe Database
        const db = new Database();
        try {
            // Connexion à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécution de la requête SQL pour récupérer des praticiens par EPCI et spécialité
            const result = await db.query(`
                SELECT 
                    T4.nom_epci,
                    JSON_AGG(json_build_object(
                        'ville', T3.nom_commune,
                        'id_code_praticien', T1.id_code_praticien,
                        'specialite', T1.libelle,
                        'valeurs', jsonb_build_object(
                            'nombre', pc_nombre.valeur,
                            'evolution_sur_5_ans', pc_evolution.valeur,
                            'apl', pc_apl.valeur
                        )
                    ) ORDER BY T1.id_code_praticien) AS praticiens
                FROM
                    praticien AS T1
                INNER JOIN
                    (
                        SELECT DISTINCT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'nombre'
                    ) AS pc_nombre ON pc_nombre.id_code_praticien = T1.id_code_praticien
                INNER JOIN
                    (
                        SELECT DISTINCT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'evolution_sur_5_ans'
                    ) AS pc_evolution ON pc_evolution.id_code_praticien = T1.id_code_praticien AND pc_evolution.id_code_commune = pc_nombre.id_code_commune
                INNER JOIN
                    (
                        SELECT DISTINCT id_code_praticien, id_code_commune, valeur
                        FROM praticien_commune
                        WHERE categorie = 'apl'
                    ) AS pc_apl ON pc_apl.id_code_praticien = T1.id_code_praticien AND pc_apl.id_code_commune = pc_nombre.id_code_commune
                INNER JOIN
                    commune AS T3 ON pc_nombre.id_code_commune = T3.id_code_commune
                INNER JOIN 
                    epci AS T4 ON T4.id_code_epci = T3.id_code_epci
                WHERE
                    T4.nom_epci = $1 AND T1.libelle = $2
                GROUP BY
                    T4.nom_epci; -- Groupe les résultats par nom d'EPCI et spécialité
            `, [praticienEpciName, praticienSpecialite]);

            // Retourner le résultat de la requête
            return result;
        } finally {
            // Fermeture de la connexion à la base de données
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Méthode statique asynchrone pour obtenir la liste de tous les praticiens
    static async getAllPraticiensList() {
        // Création d'une instance de la classe Database
        const db = new Database();
        try {
            // Connexion à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécution de la requête SQL pour récupérer la liste de tous les praticiens
            const result = await db.query(`SELECT * FROM praticien;`);

            // Retourner le résultat de la requête
            return result;
        } finally {
            // Fermeture de la connexion à la base de données
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }

    // Méthode statique asynchrone pour obtenir la liste de toutes les catégories de praticiens
    static async getAllPraticiensLibelleList() {
        // Création d'une instance de la classe Database
        const db = new Database();
        try {
            // Connexion à la base de données
            await db.connect();
            console.log("Connecté à la base de données");

            // Exécution de la requête SQL pour récupérer la liste de toutes les catégories de praticiens
            const result = await db.query(`SELECT DISTINCT categorie FROM praticien_commune;`);

            // Retourner le résultat de la requête
            return result;
        } finally {
            // Fermeture de la connexion à la base de données
            await db.close();
            console.log("Déconnecté de la base de données");
        }
    }
}

// Exporte la classe Praticiens pour qu'elle puisse être utilisée dans d'autres fichiers
export default Praticiens;
