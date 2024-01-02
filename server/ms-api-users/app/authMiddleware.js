// Importer les modules nécessaires
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
    // Vérifier si le chemin de la requête est public (ne nécessite pas d'authentification)
    if (req.path === "/users/login" || req.path === "/users" || req.path === "/resetPassword" || req.path === "/resetFormPassword" || req.path.startsWith("/verifyemail/") || req.path === "/tokenusers/") {
        // Si c'est le cas, passer à la prochaine étape du middleware
        return next();
    }

    // Extraire le jeton du header "Authorization"
    const token = req.header("Authorization");

    // Vérifier si le jeton est présent
    if (!token) {
        // Si le jeton est manquant, renvoyer une erreur d'accès non autorisé
        return res.status(401).json({ message: "Accès non autorisé." });
    }

    try {
        // Vérifier et décoder le jeton à l'aide de la clé secrète
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Ajouter les informations utilisateur à la requête pour les étapes suivantes
        req.user = decoded;
        // Passer à la prochaine étape du middleware
        next();
    } catch (error) {
        // Renvoyer une erreur avec un message indiquant que le jeton n'est pas valide
        res.status(401).json({ message: "Token non valide" });
    }
}

// Exporter le middleware pour l'utiliser dans d'autres fichiers
export default authMiddleware;
