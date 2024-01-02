import * as dataMapper from "./dataMapper.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fonction pour gérer la connexion d'un utilisateur
export async function loginUser(req, res) {
    // Extraire l'email et le mot de passe de la requête
    const { email, password } = req.body;

    try {
        // Rechercher l'utilisateur en fonction de l'email
        const user = await dataMapper.findUserByEmail(email);

        // Si l'utilisateur n'est pas trouvé, renvoyer une erreur
        if (!user) {
            throw new Error("Email ou mot de passe incorrect");
        }

        // Vérifier si le mot de passe correspond à celui stocké en base de données
        const matchPassword = await bcrypt.compare(password, user.mot_de_passe);

        // Si le mot de passe ne correspond pas, renvoyer une erreur
        if (!matchPassword) {
            throw new Error("Email ou mot de passe incorrect");
        }

        // Si l'utilisateur n'a pas de jeton, renvoyer une erreur
        if (!user.token) {
            throw new Error("Veuillez vous inscrire");
        }

        // Décoder le jeton de l'utilisateur à l'aide de la clé secrète
        const decodedToken = jwt.verify(user.token, process.env.JWT_SECRET);

        // Si le jeton n'est pas vérifié, renvoyer une erreur
        if (!decodedToken.verified) {
            throw new Error("Veuillez valider votre compte en cliquant sur le lien de confirmation envoyé à votre adresse email.");
        }

        // Renvoyer une réponse réussie avec le message, le jeton et les informations utilisateur
        return res.status(200).json({ message: "Vous êtes connecté", token: user.token, user });
    } catch (error) {
        // En cas d'erreur, renvoyer une réponse avec le message d'erreur
        return res.status(401).json(error.message);
    }
}
