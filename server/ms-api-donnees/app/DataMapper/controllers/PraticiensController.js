// Importe le module 'Praticiens' et la fonction 'parsePraticienValues' depuis les fichiers correspondants
import Praticiens from "../Praticien.js";
import { parsePraticienValues } from "../function.js";

// Fonction pour récupérer les praticiens par commune
export async function getPraticienByCommune(req, res) {
    try {
        // Récupère le nom de la commune depuis les paramètres de la requête
        const communeName = req.params.commune;

        // Appelle la fonction pour récupérer les praticiens par commune depuis le module Praticiens
        const praticiens = await Praticiens.getPraticienByCommune(communeName);

        // Convertit les propriétés spécifiques en nombres si ce sont des nombres, sinon laisse les chaînes intactes
        const parsedPraticiens = praticiens.map(praticien => {
            return {
                nom_commune: praticien.nom_commune,
                // Appelle la fonction parsePraticienValues pour chaque praticien dans la liste
                praticiens: praticien.praticiens.map(parsePraticienValues),
            };
        });

        // Renvoie la réponse JSON avec les praticiens convertis
        return res.json(parsedPraticiens);
    } catch (error) {
        // Gère les erreurs et renvoie une réponse d'erreur si nécessaire
        console.error('Erreur lors de la récupération des praticiens :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction pour récupérer les praticiens par commune et spécialité
export async function getPraticienSpecialiteByCommune(req, res) {
    try {
        // Récupère le nom de la commune et de la spécialité depuis les paramètres de la requête
        const communeName = req.params.commune;
        const specialiteName = req.params.specialite;

        // Appelle la fonction pour récupérer les praticiens par commune et spécialité depuis le module Praticiens
        const praticiens = await Praticiens.getPraticienSpecialiteByCommune(communeName, specialiteName);

        // Convertit les propriétés spécifiques en nombres si ce sont des nombres, sinon laisse les chaînes intactes
        const parsedPraticiens = praticiens.map(praticien => {
            return {
                nom_commune: praticien.nom_commune,
                // Appelle la fonction parsePraticienValues pour chaque praticien dans la liste
                praticiens: praticien.praticiens.map(parsePraticienValues),
            };
        });

        // Renvoie la réponse JSON avec les praticiens convertis
        return res.json(parsedPraticiens);
    } catch (error) {
        // Gère les erreurs et renvoie une réponse d'erreur si nécessaire
        console.error('Erreur lors de la récupération des praticiens :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction pour récupérer tous les praticiens par EPCI
export async function getAllPraticiensByEpci(req, res) {
    try {
        // Récupère le nom de l'EPCI depuis les paramètres de la requête
        const praticienEpciName = req.params.epci;

        // Appelle la fonction pour récupérer tous les praticiens par EPCI depuis le module Praticiens
        const praticiens = await Praticiens.getAllPraticiensByEpci(praticienEpciName);

        // Renvoie la réponse JSON avec les praticiens récupérés
        return res.json(praticiens);
    } catch (error) {
        // Gère les erreurs et renvoie une réponse d'erreur si nécessaire
        console.error('Erreur lors de la récupération des praticiens :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction pour récupérer les praticiens par EPCI et spécialité
export async function getPraticienByEpci(req, res) {
    try {
        // Récupère le nom de l'EPCI et de la spécialité depuis les paramètres de la requête
        const praticienEpciName = req.params.epci;
        const specialiteName = req.params.specialite;

        // Appelle la fonction pour récupérer les praticiens par EPCI et spécialité depuis le module Praticiens
        const praticiens = await Praticiens.getPraticienByEpci(praticienEpciName, specialiteName);

        // Renvoie la réponse JSON avec les praticiens récupérés
        return res.json(praticiens);
    } catch (error) {
        // Gère les erreurs et renvoie une réponse d'erreur si nécessaire
        console.error('Erreur lors de la récupération des praticiens :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction pour récupérer la liste de tous les praticiens
export async function getAllPraticiensList(req, res) {
    try {
        // Appelle la fonction pour récupérer la liste de tous les praticiens depuis le module Praticiens
        const praticiens = await Praticiens.getAllPraticiensList();

        // Renvoie la réponse JSON avec les praticiens récupérés
        return res.json(praticiens);
    } catch (error) {
        // Gère les erreurs et renvoie une réponse d'erreur si nécessaire
        console.error('Erreur lors de la récupération des praticiens :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

// Fonction pour récupérer la liste de tous les libellés de praticiens
export async function getAllPraticiensLibelleList(req, res) {
    try {
        // Appelle la fonction pour récupérer la liste de tous les libellés de praticiens depuis le module Praticiens
        const praticiens = await Praticiens.getAllPraticiensLibelleList();

        // Renvoie la réponse JSON avec les libellés de praticiens récupérés
        return res.json(praticiens);
    } catch (error) {
        // Gère les erreurs et renvoie une réponse d'erreur si nécessaire
        console.error('Erreur lors de la récupération des praticiens :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
