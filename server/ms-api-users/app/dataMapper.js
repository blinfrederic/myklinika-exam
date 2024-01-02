import * as dotenv from 'dotenv';
import pkg from 'pg';

const { Pool } = pkg;

// récupération des variables d'environnement
dotenv.config();


const pool = new Pool({
  user: process.env.PGUSER, // Utilisez les variables d'environnement
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,

});

// Création d'un utilisateur dans la BDD
export const createUser = async (user) => {
  const { nom, prenom, telephone, email, mot_de_passe, profession, id_role, creation, token } = user
  const sql = `
    INSERT INTO 
    utilisateur 
    (nom, prenom, telephone, email, mot_de_passe, profession, id_role, creation, token) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING
    *;`
  const result = await pool.query(sql, [nom, prenom, telephone, email, mot_de_passe, profession, id_role, creation, token])
  return result.rows[0];
};

// recuperer tout les utilisateurs depuis la base donnees 
export const findAllUsers = async () => {
  const sql = "SELECT * FROM utilisateur"
  const result = await pool.query(sql)
  return result.rows
};

// récupération de l'utilisateur par email
export const findUserByEmail = async (email) => {
  const sql = "SELECT * FROM utilisateur WHERE email = $1";
  const result = await pool.query(sql, [email]);
  return result.rows[0];
};

// récupération de l'utilisateur par téléphone
export const findUserByTelephone = async (telephone) => {
  const sql = "SELECT * FROM utilisateur WHERE telephone = $1";
  const result = await pool.query(sql, [telephone]);
  return result.rows[0];
};

// je veux toutes les données d'un utilisateur par son id dans la table utilisateur 
export const findUserById = async (userId) => {
  const sql = "SELECT nom, prenom, telephone, profession, adresse, code_postal, ville FROM utilisateur WHERE id_user = $1";
  const result = await pool.query(sql, [userId]);
  return result.rows[0];
};

// je veux toutes les données d'un utilisateur par son id dans la table utilisateur 
export const findPasswordById = async (userId) => {
  const sql = "SELECT mot_de_passe FROM utilisateur WHERE id_user = $1";
  const result = await pool.query(sql, [userId]);
  return result.rows[0];
};

// mise à jour des infos utilisateur
export const updateUserById = async (updatedData, id) => {
  const { nom, prenom, telephone, adresse, profession, code_postal, ville, } = updatedData;
  const sql = `
      UPDATE
        utilisateur 
      SET
        nom = $1,
        prenom = $2,
        telephone = $3,
        adresse = $4,
        profession = $5,
        code_postal = $6,
        ville = $7
      WHERE id_user = $8
      RETURNING *;
    `;
  const result = await pool.query(sql, [nom, prenom, telephone, adresse, profession, code_postal, ville, id])
  return result.rows[0];
}

// mise à jour du MDP
export const updatePasswordUserById = async (updatedPassword, id) => {
  const sql = `
  UPDATE
  utilisateur
  SET
  mot_de_passe = $1
  WHERE id_user = $2
  RETURNING *;
  `;
  const result = await pool.query(sql, [updatedPassword, id])
  return result.rows[0];
}

// suppression de l'utilisateur
export const deleteUserById = async (id) => {
  const sql = `
        DELETE FROM utilisateur
        WHERE id_user = $1
        RETURNING *;
    `;
  const result = await pool.query(sql, [id]);
  return result.rows[0];
};

// mise à jour du token 
export const updateTokenUserByEmail = async (token, email) => {
  const sql = `
  UPDATE
  utilisateur
  SET
  token = $1
  WHERE email = $2
  RETURNING *;
  `;
  const result = await pool.query(sql, [token, email])
  return result.rows[0];
}

// récupération du token
export const getTokenUserByEmail = async (email) => {
  const sql = "SELECT token FROM utilisateur WHERE email = $1";
  const result = await pool.query(sql, [email]);
  return result.rows[0];
};
