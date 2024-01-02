import Joi from 'joi';

// vérification de mise en forme avec joi pour le createUser
export const userSchema = Joi.object({
    nom: Joi.string().max(15).required().messages({
        'string.empty': 'Le nom est obligatoire',
        'string.max': 'Le nom ne doit pas dépasser {#limit} caractères.',
    }),
    prenom: Joi.string().max(15).required().messages({
        'string.empty': 'Le prénom est obligatoire',
        'string.max': 'Le prénom ne doit pas dépasser {#limit} caractères.',
    }),
    telephone: Joi.string().min(10).max(15).required().messages({
        'string.empty': 'Le numéro de téléphone est obligatoire',
        'string.min': 'Le numéro de téléphone doit avoir au moins {#limit} chiffres.',
        'string.max': 'Le numéro de téléphone ne doit pas dépasser {#limit} chiffres.',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'L\'adresse e-mail est obligatoire',
        'string.email': 'L\'adresse e-mail doit être valide.',
    }),
    mot_de_passe: Joi.string().min(12).required().messages({
        'string.empty': 'Le mot de passe est obligatoire',
        'string.min': 'Le mot de passe doit avoir au moins {#limit} caractères.',
    }),
    confirm_mdp: Joi.string().valid(Joi.ref('mot_de_passe')).required().messages({
        'string.empty': 'La confirmation du mot de passe est obligatoire',
        'any.only': 'La confirmation du mot de passe doit correspondre au mot de passe.',
    }),
    profession: Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
        'string.empty': 'La profession est obligatoire',
        'string.pattern.base': 'La profession ne doit contenir que des lettres.',
    }),
    creation: Joi.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).required().messages({
        'string.empty': 'La date de création est obligatoire',
        'string.pattern.base': 'La date de création doit être au format JJ/MM/AAAA.',
    }),
    token: Joi.alternatives().try(Joi.string(), Joi.number()).messages({
        'alternatives.types': 'Le token doit être une chaîne de caractères ou un nombre.',
    }),
    id_role: Joi.number().messages({
        'number.base': 'L\'ID de rôle doit être un nombre.',
    }),
});

// vérification de mise en forme avec joi pour le updateUserById
export const userUpdateSchema = Joi.object({
    nom: Joi.string().max(15).required().messages({
        'string.empty': 'Le nom est obligatoire',
        'string.max': 'Le nom ne doit pas dépasser {#limit} caractères.',
    }),
    prenom: Joi.string().max(15).required().messages({
        'string.empty': 'Le prénom est obligatoire',
        'string.max': 'Le prénom ne doit pas dépasser {#limit} caractères.',
    }),
    telephone: Joi.string().min(10).max(15).required().messages({
        'string.empty': 'Le numéro de téléphone est obligatoire',
        'string.min': 'Le numéro de téléphone doit avoir au moins {#limit} chiffres.',
        'string.max': 'Le numéro de téléphone ne doit pas dépasser {#limit} chiffres.',
    }),
    adresse: Joi.string().allow(null).default('default value').max(100).regex(/^(?=.*[0-9])(?=.*[a-zA-Z])/).messages({
        'string.max': 'L\'adresse ne doit pas dépasser {#limit} caractères.',
        'string.pattern.base': 'L\'adresse doit contenir au moins un chiffre et une lettre.',

    }),

    code_postal: Joi.string().allow(null).default('default value').regex(/^[0-9\s]+$/).max(5).messages({
        'string.max': 'Le code postal ne doit pas dépasser {#limit} caractères.',
        'string.pattern.base': 'Le code postal doit contenir uniquement des chiffres et des espaces.',
    }),
    ville: Joi.string().allow(null).default('default value').max(40).messages({
        'string.max': 'La ville ne doit pas dépasser {#limit} caractères.',
    }),
    profession: Joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
        'string.empty': 'La profession est obligatoire',
        'string.pattern.base': 'La profession ne doit contenir que des lettres.',
    }),
});


// vérification de mise en forme avec joi pour le updatePasswordUserById
export const userChangePasswordSchema = Joi.object({
    nouveau_mdp: Joi.string().min(12).required().messages({
        'string.empty': 'Le mot de passe est obligatoire',
        'string.min': 'Le mot de passe doit avoir au moins {#limit} caractères.',
    }),
    confirm_mdp: Joi.string().valid(Joi.ref('nouveau_mdp')).required().messages({
        'string.empty': 'La confirmation du mot de passe est obligatoire',
        'any.only': 'La confirmation du mot de passe doit correspondre au nouveau mot de passe.',
    }),
});