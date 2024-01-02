import validator from "validator";
import bcrypt from "bcrypt";
import { format } from "date-fns";
import * as dataMapper from "./dataMapper.js";
import jwt from 'jsonwebtoken';
import { userSchema, userUpdateSchema, userChangePasswordSchema } from "./Models/user.js";
import * as dotenv from "dotenv";
import { transporter } from "./transporter.js";
dotenv.config();

export const createUser = async (req, res) => {
    try {
        const { nom, prenom, telephone, email, mot_de_passe, confirm_mdp, profession } = req.body;
        const userMail = await dataMapper.findUserByEmail(email);
        const userPhone = await dataMapper.findUserByTelephone(telephone);
        if (userMail) {
            throw new Error("Email déjà utilisé");
        }
        if (userPhone) {
            throw new Error("Numero de telephone déjà utilisé");
        }

        // Validez les données avant de les modifier (hacher le mot de passe)
        await userSchema.validateAsync({
            nom,
            prenom,
            email,
            mot_de_passe,
            confirm_mdp,
            telephone,
            profession,
            creation: format(new Date(), 'dd/MM/yyyy'),
        });

        const verificationToken = jwt.sign({ verified: false }, process.env.JWT_SECRET, { expiresIn: '3d' });
        const verificationLink = `${process.env.API_USER_URL}/verifyemail/${email}/${verificationToken}`;
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: req.body.email,
            subject: 'Validation de compte',
            html: `
            <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif;">
                <h1 style="color: #333;">Bienvenue sur Myklinica !</h1>
                <p style="color: #555;">Cliquez sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
                <a href="${verificationLink}" style="background-color: #184066; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Vérifier mon adresse e-mail</a>
                <p style="color: #555; margin-top: 20px;">Si vous avez des questions, n'hésitez pas à nous contacter à l'adresse suivante : <a href="mailto:contact@myklinica.com">contact@myklinica.com</a></p>
            </div>
        `

        });
        // Hachez le mot de passe après la validation
        const hashPassword = bcrypt.hashSync(mot_de_passe, 10);

        // Créez un nouvel objet utilisateur avec le mot de passe haché
        const newUser = {
            nom,
            prenom,
            email,
            mot_de_passe: hashPassword, // Utilisez le mot de passe haché ici
            confirm_mdp,
            telephone,
            profession,
            creation: format(new Date(), 'dd/MM/yyyy'),
            token: verificationToken,
            id_role: 1,
        };

        // Enregistrez l'utilisateur dans la base de données
        const result = await dataMapper.createUser(newUser);

        // Envoyez une réponse réussie
        res.status(200).json('Compte utilisateur créé avec succès');

    } catch (error) {
        // Gérez les erreurs de validation et autres erreurs ici
        if (error.isJoi) {
            // Erreurs de validation
            console.error(error.details);
            const validationErrors = error.details.map(detail => detail.message);
            res.status(400).json({ errors: validationErrors });
        } else {
            // Autres types d'erreurs
            console.error({ errors: [error.message] });
            res.status(500).json({ errors: [error.message] });
        }
    }
};

// récuperer tous les utilisateurs 
export const getAllUsers = async (req, res) => {
    try {
        const result = await dataMapper.findAllUsers()
        res.json(result);
    } catch (error) {
        console.error("erreur de la base de données ", error.message);
        res.status(400).json({ error: error.message });
    }
};

// récupérer un utilisateur pas son id
export const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await dataMapper.findUserById(userId)
        if (result) {
            res.json(result);
        }
        else {
            // res.json("utilisateur non trouvé")
            throw new Error("utilisateur non trouvé")
        }
    } catch (error) {
        console.error(" une erreur c'est produite lors de la recuperation de l'utilisateur", error.message);
        res.status(404).json({ message: "utilisateur non trouvé" });
    }
};

// Mise à jour des utilisateurs par id
export const updateUserById = async (req, res,) => {
    const id = parseInt(req.params.id);
    const { nom, prenom, telephone, profession, adresse, code_postal, ville } = req.body;

    const user = await dataMapper.findUserById(id)
    try {
        if (!user) {
            res.status(404).json({ message: 'utilisateur non trouvé' });
        } else {

            await userUpdateSchema.validateAsync({
                nom,
                prenom,
                adresse,
                code_postal,
                ville,
                telephone,
                profession,
            });

            const updatedUserData = await dataMapper.updateUserById(req.body, id);

            res.status(200).json(updatedUserData);

        }
    } catch (error) {
        // Gérez les erreurs de validation et autres erreurs ici
        if (error.isJoi) {
            // Erreurs de validation
            console.error(error.details);
            const validationErrors = error.details.map(detail => detail.message);
            res.status(400).json({ errors: validationErrors });
        } else {
            // Autres types d'erreurs
            console.error({ errors: [error.message] });
            res.status(500).json({ errors: [error.message] });
        }
    }
};

// changement de mot de passe 
export const updatePasswordUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    const { mot_de_passe, confirm_mdp, nouveau_mdp } = req.body;
    console.log("je suis un jolie id", id);
    
    try { 
        // Vérifiez si le mot de passe actuel est correct
        const user = await dataMapper.findPasswordById(id);
        const isPasswordCorrect = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isPasswordCorrect) {
            throw new Error("Mot de passe incorrect");
        }

        // Vérifiez si le nouveau mot de passe est différent de l'ancien
        if (nouveau_mdp === mot_de_passe) {
            throw new Error(`Le nouveau mot de passe doit être différent de l'ancien`);

        }

        await userChangePasswordSchema.validateAsync({
            nouveau_mdp,
            confirm_mdp,
        });


        // Hachez le nouveau mot de passe
        const hashNewPassword = await bcrypt.hash(nouveau_mdp, 10);

        // Mettez à jour le mot de passe dans la base de données
        const passwordOk = await dataMapper.updatePasswordUserById(hashNewPassword, id);

        // Répondre avec succès
        res.status(200).json({ passwordOk, message: "Mot de passe modifié avec succès" });

    } catch (error) {
        // Gérez les erreurs de validation et autres erreurs ici
        if (error.isJoi) {
            // Erreurs de validation
            console.error(error.details);
            const validationErrors = error.details.map(detail => detail.message);
            res.status(400).json({ errors: validationErrors });
        } else {
            // Autres types d'erreurs
            console.error({ errors: [error.message] });
            res.status(500).json({ errors: [error.message] });
        }
    }
};



// suppression de l'utilisateur par son id
export const deleteUserById = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        // Vérifiez si l'utilisateur existe avant de le supprimer
        const user = await dataMapper.findUserById(id);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        // Supprimez l'utilisateur
        const deletedUser = await dataMapper.deleteUserById(id);

        // Répondez avec l'utilisateur supprimé
        return res.status(200).json({ message: 'Utilisateur supprimé avec succès', deletedUser });
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression de l'utilisateur : ", error.message);
        return res.status(500).json(error.message);
    }
};

// vérification d'email
export const verifyEmail = async (req, res) => {
    const { email, token } = req.params; // Récupère le token du chemin de l'URL

    try {
        const userToken = await dataMapper.getTokenUserByEmail(email);

        if (!userToken) {
            throw new Error('Token introuvable pour cet utilisateur');
        }

        const userTokenDecoded = jwt.verify(userToken.token, process.env.JWT_SECRET); // Vérifie le token

        const decodedUrlToken = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token

        if (userToken.token !== token || decodedUrlToken.verified || userTokenDecoded.verified) {
            throw new Error('Token invalide ou utilisateur déjà vérifié');
        }

        const newToken = jwt.sign({ verified: true }, process.env.JWT_SECRET);
        await dataMapper.updateTokenUserByEmail(newToken, email);
        res.redirect('http://localhost:3000'); // Redirection après vérification réussie

    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error.message);
        res.status(401).json(error.message)
    }
}

// envois de mail de récupération de MDP
export const resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await dataMapper.findUserByEmail(email);

        if (user) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const resetLink = `${process.env.FRONT_ADRESS}/resetpassword/${token}`;

            await transporter.sendMail({
                from: process.env.MAIL_USER,
                to: req.body.email,
                subject: 'Rappel de mot de passe',
                html: `
                <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif;">
                    <h1 style="color: #333;">Bienvenue sur Myklinica !</h1>
                    <p style="color: #555;">Cliquez sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
                    <a href="${resetLink}" style="background-color: #184066; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Vérifier mon adresse e-mail</a>
                    <p style="color: #555; margin-top: 20px;">Si vous avez des questions, n'hésitez pas à nous contacter à l'adresse suivante : <a href="mailto:contact@myklinica.com">contact@myklinica.com</a></p>
                </div>
                `

            });

        }

        res.status(200).json({ message: "Email envoyé" });
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);
        res.status(401).json('Erreur de vérification du token. Veuillez réessayer.');
    }
}

// récupération de MDP
export const resetFormPassword = async (req, res) => {
    const { token, nouveau_mdp, confirm_mdp } = req.body
    try {

        if (!token) {
            throw new Error("Token invalide");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const expirationDate = decodedToken.expiresIn
        const email = decodedToken.email

        // si le token est expiré on ira pas plus loin dans cette demande

        if (Date.now() > expirationDate) {
            throw new Error("Token expiré");
        }

        if (!validator.isStrongPassword(nouveau_mdp, { minLength: 12 })) {
            // je renvoie une erreur 
            throw new Error("sécuriter du mot de passe insuffisante");
        }

        // si le mot de passe et la confirmation sont differente
        if (nouveau_mdp !== confirm_mdp) {
            // j'envoie une erreur 
            throw new Error("les mots de passe doivent etre identique");
        }

        // hacher le mot de passe
        const hashPassword = bcrypt.hashSync(nouveau_mdp, 10);

        // tout va bien on modifie le mot de passe de l'utlisateur 

        const user = await dataMapper.findUserByEmail(email);

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        const passwordOk = await dataMapper.updatePasswordUserById(
            hashPassword, user.id_user
        );
        res.status(200).json({ passwordOk, message: "Mot de passe modifié avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error.message);
    }
}