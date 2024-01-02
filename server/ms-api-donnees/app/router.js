// Importe le framework Express et les contrôleurs depuis les fichiers correspondants
import express from 'express';
import * as controllerEpcis from './DataMapper/controllers/EpcisControllers.js';
import * as controllerPraticiens from './DataMapper/controllers/PraticiensController.js';
import * as controllerCommunes from './DataMapper/controllers/CommunesController.js';
import * as controllerDocs from './DataMapper/controllers/DocsControllers.js';

// Crée un routeur Express
export const router = express.Router();

// Définit les routes avec les contrôleurs associés
router.get('/documentation', controllerDocs.homePage); // Route pour la page d'accueil

// Routes pour les communes
router.get('/commune/:name/:libelle', controllerCommunes.getCommuneByName); //ok
router.get('/communes/pagination/:pageNumber', controllerCommunes.getAllCommunes); //ok

// Routes pour les EPCIs (Établissements Publics de Coopération Intercommunale)
router.get('/epcis/pagination/:pageNumber', controllerEpcis.getAllEpcis); //ok
router.get('/epci/:codeEpci', controllerEpcis.getEpciByCodeEpci); //ok
router.get('/epci/:codeEpci/:libelle', controllerEpcis.getEpciByCodeEpciAndLibelle); //ok
router.get('/epci/communes/:codeEpci/:libelle/', controllerEpcis.getCommunesByEpciAndLibelle); //ok
router.get('/epcis/libelle/:libelle', controllerEpcis.getAllEpcisByLibelle); //ok
router.get('/epcis/communes/:name', controllerEpcis.getAllCommunesByEpci); //ok
router.get('/epcis/libelle-liste', controllerEpcis.getAllEpcisList); //ok

// Routes pour les praticiens
router.get('/praticiens/commune/:commune', controllerPraticiens.getPraticienByCommune); //ok
router.get('/praticiens/commune/:commune/:specialite', controllerPraticiens.getPraticienSpecialiteByCommune); //ok
router.get('/praticiens/epci/:epci', controllerPraticiens.getAllPraticiensByEpci); //ok
router.get('/praticiens/epci/:epci/:specialite', controllerPraticiens.getPraticienByEpci); //ok
router.get('/praticien/:libelle/:categorie', controllerEpcis.getAllEpcisByLibelleAndCategory);
router.get('/praticiens-liste', controllerPraticiens.getAllPraticiensList);
router.get('/praticiens-libelle-liste', controllerPraticiens.getAllPraticiensLibelleList);

// Exporte le routeur pour être utilisé dans d'autres fichiers
export default router;
