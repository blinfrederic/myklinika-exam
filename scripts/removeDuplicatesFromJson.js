import epcis from './formatted-epci/epcis_mayotte.json' assert { type: "json" };
import fs from 'fs';

const removeDuplicatesFromJson = (epcis) => {
    let uniqueArray = [];
    let uniqueIds = new Set();

    for (let obj of epcis) {
        if (!uniqueIds.has(obj.properties.code)) {
            uniqueArray.push(obj);
            uniqueIds.add(obj.properties.code);
        }
    }
    return uniqueArray;
};

// Convertir l'objet en JSON et écrire le fichier JSON sur une seule ligne
let epcisJson = JSON.stringify(removeDuplicatesFromJson(epcis));
fs.writeFileSync('epcis_mayotte.json', epcisJson, 'utf-8');

console.log('Fichier JSON créé avec succès sur une seule ligne.');
