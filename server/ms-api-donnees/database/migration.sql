BEGIN;

SET CLIENT_ENCODING TO 'UTF-8';

DROP TABLE IF EXISTS "categorie_epci", "epci", "categorie_commune", "commune", "praticien", "role", "utilisateur", "favori", "praticien_commune", "favori_commune", "favori_epci", "categorie_has_epci", "categorie_has_commune" CASCADE;

CREATE TABLE categorie_epci(
   id_categorie_epci INT GENERATED ALWAYS AS IDENTITY,
   libelle VARCHAR(50) NOT NULL,
   type VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_categorie_epci)
);

CREATE TABLE epci(
   id_code_epci VARCHAR(20),
   nom_epci VARCHAR(100) NOT NULL,
   PRIMARY KEY(id_code_epci)
);

CREATE TABLE categorie_commune(
   id_categorie_commune INT GENERATED ALWAYS AS IDENTITY,
   libelle VARCHAR(50) NOT NULL,
   type VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_categorie_commune)
);

CREATE TABLE commune(
   id_code_commune VARCHAR(10),
   nom_commune VARCHAR(50) NOT NULL,
   id_code_epci VARCHAR(20),
   PRIMARY KEY(id_code_commune),
   FOREIGN KEY(id_code_epci) REFERENCES epci(id_code_epci)
);

CREATE TABLE praticien(
   id_code_praticien INT,
   libelle VARCHAR(100),
   PRIMARY KEY(id_code_praticien)
);

CREATE TABLE role(
   id_role INT,
   nom VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_role),
   UNIQUE(nom)
);

CREATE TABLE utilisateur(
   id_user INT GENERATED ALWAYS AS IDENTITY,
   nom VARCHAR(50),
   prenom VARCHAR(50),
   email VARCHAR(255),
   mot_de_passe VARCHAR(255),
   telephone VARCHAR(50),
   adresse VARCHAR(255),
   code_postal VARCHAR(20),
   ville VARCHAR(50),
   profession VARCHAR(50),
   creation DATE ,
   id_role INT,
   token VARCHAR(255),
   PRIMARY KEY(id_user),
   UNIQUE(email),
   UNIQUE(telephone),
   FOREIGN KEY(id_role) REFERENCES role(id_role)
);

CREATE TABLE favori(
   id_favori INT,
   type_favori VARCHAR(50) NOT NULL,
   id_code_commune VARCHAR(10),
   id_code_epci VARCHAR(20),
   id_user INT NOT NULL,
   PRIMARY KEY(id_favori),
   FOREIGN KEY(id_user) REFERENCES utilisateur(id_user)
);

CREATE TABLE praticien_commune(
   id INT GENERATED ALWAYS AS IDENTITY,
   id_code_commune VARCHAR(10),
   id_code_praticien INT,
   categorie VARCHAR(50) NOT NULL,
   valeur VARCHAR(250),
   PRIMARY KEY(id),
   FOREIGN KEY(id_code_commune) REFERENCES commune(id_code_commune),
   FOREIGN KEY(id_code_praticien) REFERENCES praticien(id_code_praticien)
);


CREATE TABLE favori_commune(
   id_code_commune VARCHAR(10),
   id_favori INT,
   PRIMARY KEY(id_code_commune, id_favori),
   FOREIGN KEY(id_code_commune) REFERENCES commune(id_code_commune),
   FOREIGN KEY(id_favori) REFERENCES favori(id_favori)
);

CREATE TABLE favori_epci(
   id_code_epci VARCHAR(20),
   id_favori INT,
   PRIMARY KEY(id_code_epci, id_favori),
   FOREIGN KEY(id_code_epci) REFERENCES epci(id_code_epci),
   FOREIGN KEY(id_favori) REFERENCES favori(id_favori)
);

CREATE TABLE categorie_has_epci(
   id_categorie_epci INT,
   id_code_epci VARCHAR(20),
   valeur VARCHAR(250) NOT NULL,
   PRIMARY KEY(id_categorie_epci, id_code_epci),
   FOREIGN KEY(id_categorie_epci) REFERENCES categorie_epci(id_categorie_epci),
   FOREIGN KEY(id_code_epci) REFERENCES epci(id_code_epci)
);

CREATE TABLE categorie_has_commune(
   id_categorie_commune INT,
   id_code_commune VARCHAR(10),
   valeur VARCHAR(250) NOT NULL,
   PRIMARY KEY(id_categorie_commune, id_code_commune),
   FOREIGN KEY(id_categorie_commune) REFERENCES categorie_commune(id_categorie_commune),
   FOREIGN KEY(id_code_commune) REFERENCES commune(id_code_commune)
);

GRANT ALL PRIVILEGES ON DATABASE myklinica TO myklinica;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myklinica;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myklinica;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO myklinica;

INSERT INTO 
   "role"
   ("id_role", "nom")
VALUES
   (1, 'praticien'),
   (2, 'admin');

COMMIT;