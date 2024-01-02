// Importe le module 'Epcis' et la fonction 'parseCategoryValues' depuis les fichiers correspondants
import Epcis from '../Epcis.js';
import { parseCategoryValues } from '../function.js';

// Fonction asynchrone pour récupérer toutes les entités Epcis paginées
export async function getAllEpcis(req, res) {
    try {
        // Récupère le numéro de page à partir des paramètres de la requête ou utilise la page 1 par défaut
        const pageNumber = req.params.pageNumber || 1;

        // Appelle la méthode getAllEpcis du module Epcis avec le numéro de page
        const epcis = await Epcis.getAllEpcis(pageNumber);

        // Traite les valeurs numériques dans les catégories de chaque Epcis en utilisant la fonction 'parseCategoryValues'
        const epcisWithParsedCategories = epcis.map(epci => ({
            ...epci,
            categories: parseCategoryValues(epci.categories)
        }));

        // Retourne les Epcis traités au format JSON
        return res.json(epcisWithParsedCategories);
    } catch (error) {
        // En cas d'erreur, logge l'erreur et renvoie une réponse d'erreur avec le statut 500
        console.error('Erreur lors de la récupération des Epcis :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction asynchrone pour récupérer toutes les entités Epcis par libellé
export async function getAllEpcisByLibelle(req, res) {
    try {
        // Récupère le libellé à partir des paramètres de la requête
        const libelle = req.params.libelle;

        // Appelle la méthode getAllEpcisByLibelle du module Epcis avec le libellé
        const epcis = await Epcis.getAllEpcisByLibelle(libelle);

        // Convertit la propriété 'valeur' en nombre en remplaçant la virgule par un point
        const epcisWithParsedCategories = epcis.map(epci => ({
            ...epci,
            valeur: Number(epci.valeur.replace(',', '.'))
        }));

        // Retourne les Epcis traités au format JSON
        return res.json(epcisWithParsedCategories);
    } catch (error) {
        console.error('Erreur lors de la récupération des Epcis :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction asynchrone pour récupérer une entité Epcis par son code Epci
export async function getEpciByCodeEpci(req, res) {
    try {
        // Récupère le code Epci à partir des paramètres de la requête
        const codeEpci = req.params.codeEpci;

        // Appelle la méthode getEpciByCodeEpci du module Epcis avec le code Epci
        const epcis = await Epcis.getEpciByCodeEpci(codeEpci);

        // Convertit les propriétés spécifiques en nombres si ce sont des nombres, sinon laisse les chaînes intactes
        const parsedEpcis = epcis.map(epci => {
            return {
                id_code_epci: epci.id_code_epci,
                nom_epci: epci.nom_epci,
                categories: parseCategoryValues(epci.categories),
                // Convertit d'autres propriétés en nombres si nécessaire
            };
        });

        // Retourne les Epcis traités au format JSON
        return res.json(parsedEpcis);
    } catch (error) {
        console.error('Erreur lors de la récupération des Epcis :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction asynchrone pour récupérer une entité Epcis par son code Epci et libellé
export async function getEpciByCodeEpciAndLibelle(req, res) {
    try {
        // Récupère le code Epci et le libellé à partir des paramètres de la requête
        const codeEpci = req.params.codeEpci;
        const libelle = req.params.libelle;

        // Appelle la méthode getEpciByCodeEpciAndLibelle du module Epcis avec le code Epci et le libellé
        const epcis = await Epcis.getEpciByCodeEpciAndLibelle(codeEpci, libelle);

        // Convertit les propriétés spécifiques en nombres si ce sont des nombres, sinon laisse les chaînes intactes
        const parsedEpcis = epcis.map(epci => {
            return {
                id_code_epci: epci.id_code_epci,
                nom_epci: epci.nom_epci,
                categories: parseCategoryValues(epci.categories),
                // Convertit d'autres propriétés en nombres si nécessaire
            };
        });

        // Retourne les Epcis traités au format JSON
        return res.json(parsedEpcis);
    } catch (error) {
        console.error('Erreur lors de la récupération des Epcis :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction asynchrone pour récupérer toutes les communes associées à un Epci
export async function getAllCommunesByEpci(req, res) {
    try {
        // Récupère le nom de l'Epci à partir des paramètres de la requête
        const epciName = req.params.name;

        // Appelle la méthode getAllCommunesByEpci du module Epcis avec le nom de l'Epci
        const communes = await Epcis.getAllCommunesByEpci(epciName);

        // Retourne les communes associées à l'Epci au format JSON
        return res.json(communes);
    } catch (error) {
        console.error('Erreur lors de la récupération des communes :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction asynchrone pour récupérer la liste de toutes les entités Epcis
export async function getAllEpcisList(req, res) {
    try {
        // Appelle la méthode getAllEpcisList du module Epcis pour obtenir la liste de toutes les entités Epcis
        const epcis = await Epcis.getAllEpcisList();

        // Retourne la liste des Epcis au format JSON
        return res.json(epcis);
    } catch (error) {
        console.error('Erreur lors de la récupération des Epcis :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction asynchrone pour récupérer toutes les entités Epcis par libellé et catégorie
export async function getAllEpcisByLibelleAndCategory(req, res) {
    try {
        // Récupère le libellé et la catégorie à partir des paramètres de la requête
        const libelle = req.params.libelle;
        const categorie = req.params.categorie;

        // Appelle la méthode getAllEpcisByLibelleAndCategory du module Epcis avec le libellé et la catégorie
        const epcis = await Epcis.getAllEpcisByLibelleAndCategory(libelle, categorie);

        // Traite les valeurs des communes en convertissant les chaînes en nombres et effectue des calculs spécifiques en fonction de la catégorie
        epcis.forEach(epci => {
            epci.communes.forEach(commune => {
                if (commune.valeur.includes('N/A')) {
                    commune.valeur = 0;
                } else {
                    // Convertit la chaîne en nombre en remplaçant la virgule par un point
                    commune.valeur = parseFloat(commune.valeur.replace(',', '.'));
                }
            });

            if (categorie === 'apl') {
                // Fait la moyenne des valeurs des communes en ignorant les "N/A"
                const validCommunes = epci.communes.filter(commune => commune.valeur !== 0);
                const sum = validCommunes.reduce((acc, commune) => {
                    return acc + commune.valeur;
                }, 0);
                epci.totalValeurPraticien = sum / validCommunes.length;
            } else if (categorie === 'evolution_sur_5_ans') {
                // Calcule la somme des valeurs des communes
                epci.totalValeurPraticien = epci.communes.reduce((acc, commune) => {
                    return acc + commune.valeur;
                }, 0);
            } else if (categorie === 'nombre_de_praticiens') {
                // Calcule la densité de praticiens par commune (nombre de praticiens / population * 10000)
                // Calcule la somme des valeurs des communes
                const totalPraticiens = epci.totalValeurPraticien = epci.communes.reduce((acc, commune) => {
                    return acc + commune.valeur;
                }, 0);

                const densitePraticiens = totalPraticiens / epci.population * 100000;

                epci.totalValeurPraticien = densitePraticiens;
            }
        });

        // Retourne les Epcis traités au format JSON
        return res.json(epcis);
    } catch (error) {
        console.error('Erreur lors de la récupération des Epcis :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction asynchrone pour récupérer les communes associées à un Epci par son code Epci et libellé
export async function getCommunesByEpciAndLibelle(req, res) {
    try {
        // Récupère le code Epci et le libellé à partir des paramètres de la requête
        const codeEpci = req.params.codeEpci;
        const libelle = req.params.libelle;

        // Appelle la méthode getCommunesByEpciAndLibelle du module Epcis avec le code Epci et le libellé
        const communes = await Epcis.getCommunesByEpciAndLibelle(codeEpci, libelle);

        // Retourne les communes associées à l'Epci au format JSON
        return res.json(communes);
    } catch (error) {
        console.error('Erreur lors de la récupération des communes :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
