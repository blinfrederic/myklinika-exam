// Sert à insérer les données de la base de données
import insertDataFromCsv from './database/scripts/insertDataFromCsv.js';
// Sert à insérer les epcis, les communes et les praticiens
import insertDataFromCsvSimple from './database/scripts/insertDataFromCsvSimple.js';
// Sert à insérer les données des praticiens
import insertDataFromCsvPraticien from './database/scripts/insertDataFromCsvPraticien.js';

// EPCIS
async function seedingEpcis() {

    try {

        // Noms et codes des EPCIs
        const data_epcis = './database/data-csv/data/epcis/noms_epcis';
        const insertSQL_epcis = 'INSERT INTO epci (id_code_epci, nom_epci) VALUES ($1, $2);';
        const numberColumns1 = 2;
        await insertDataFromCsvSimple(data_epcis, insertSQL_epcis, numberColumns1);

        // Données des EPCIs
        for (let i = 0; i < 11; i++) {
            const type = 'epci';
            const folderPath = './database/data-csv/data/epcis/donnees_epcis';
            const selectCheck = `SELECT id_categorie_${type} FROM categorie_${type} WHERE libelle = $1;`;
            const insertCategorie = `INSERT INTO categorie_${type} (libelle, type) VALUES ($1, $2) RETURNING id_categorie_${type};`;
            const insertData = `INSERT INTO categorie_has_${type} (id_categorie_${type}, id_code_${type}, valeur) VALUES ($1, $2, $3);`;
            const numberColumnsPush = [i];
            const numberColumns2 = 11;
            const referenceColumn = 0;
            await insertDataFromCsv(folderPath, selectCheck, insertCategorie, insertData, numberColumnsPush, numberColumns2, referenceColumn, type);
        }
    } catch (error) {
        console.log('Erreur lors de l\'insertion des données: ', error)
    }
}

// COMMUNES
async function seedingCommunes() {

    try {

        // Noms et codes des communes
        const data_communes = './database/data-csv/data/communes/nom-communes';
        const insertSQL_communes = 'INSERT INTO commune (id_code_commune, nom_commune, id_code_epci) VALUES ($1, $2, $3)';
        const numberColumns1 = 3;
        await insertDataFromCsvSimple(data_communes, insertSQL_communes, numberColumns1);

        // Données des communes
        for (let i = 0; i < 18; i++) {
            const type = 'commune';
            const folderPath = './database/data-csv/data/communes/donnees-communes';
            const selectCheck = `SELECT id_categorie_${type} FROM categorie_${type} WHERE libelle = $1;`;
            const insertCategorie = `INSERT INTO categorie_${type} (libelle, type) VALUES ($1, $2) RETURNING id_categorie_${type};`;
            const insertData = `INSERT INTO categorie_has_${type} (id_categorie_${type}, id_code_${type}, valeur) VALUES ($1, $2, $3);`;
            const numberColumnsPush = [i];
            const numberColumns2 = 18;
            const referenceColumn = 0;
            await insertDataFromCsv(folderPath, selectCheck, insertCategorie, insertData, numberColumnsPush, numberColumns2, referenceColumn, type);

        }
    } catch (error) {
        console.log('Erreur lors de l\'insertion des données: ', error)
    }
}

// PRATICIENS
async function seedingPraticiens() {

    try {

        // Noms et codes des praticiens
        const data_praticiens1 = './database/data-csv/data/praticiens/noms-praticiens';
        const insertSQL_praticiens = 'INSERT INTO praticien (id_code_praticien, libelle) VALUES ($1, $2)';
        const numberColumns1 = 2;
        await insertDataFromCsvSimple(data_praticiens1, insertSQL_praticiens, numberColumns1);

        // Données des praticiens
        const data_praticiens2 = './database/data-csv/data/praticiens/donnees-praticiens';
        const numberColumns2 = 4;
        insertDataFromCsvPraticien(data_praticiens2, numberColumns2);

    } catch (error) {
        console.log('Erreur lors de l\'insertion des données: ', error)
    }

}

console.log('Seeding de la base de données en cours...');

await seedingEpcis();
await seedingCommunes();
await seedingPraticiens();

console.log('Seeding de la base de données terminé.');