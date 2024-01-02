// Importe le module Communes depuis le fichier 'Communes.js'
import Communes from '../Communes.js';

// Fonction asynchrone pour récupérer toutes les communes
export async function getAllCommunes(req, res) {
    try {
        // Récupère le numéro de page à partir des paramètres de la requête
        const pageNumber = req.params.pageNumber || 1;

        // Appelle la méthode getAllCommunes du module Communes avec le numéro de page
        const communes = await Communes.getAllCommunes(pageNumber);

        // Retourne la liste des communes au format JSON
        return res.json(communes);
    } catch (error) {
        // En cas d'erreur, logge l'erreur et renvoie une réponse d'erreur avec le statut 500
        console.error('Erreur lors de la récupération des communes :', error);
        res.status(500).json({ status: 'error', error: 'Erreur serveur' });
    }
}

// Fonction asynchrone pour récupérer une commune par son nom
export async function getCommuneByName(req, res) {
    try {
        // Récupère le nom de la commune à partir des paramètres de la requête
        const communeName = req.params.name;
        const libelle = req.params.libelle;

        // Appelle la méthode getCommuneByName du module Communes avec le nom de la commune
        const communes = await Communes.getCommuneByName(communeName, libelle);

        // Retourne la commune correspondante au format JSON
        return res.json(communes);
    } catch (error) {
        // En cas d'erreur, logge l'erreur et renvoie une réponse d'erreur avec le statut 500
        console.error('Erreur lors de la récupération des communes :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
