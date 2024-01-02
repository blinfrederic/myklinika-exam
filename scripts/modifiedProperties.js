import fs from 'fs';
import path from 'path';

// Chemin du dossier contenant les fichiers JSON
const dossier = './epci';

// Liste des fichiers dans le dossier
const fichiers = fs.readdirSync(dossier);

// Fonction pour appliquer les modifications aux fichiers JSON
function selectedFilter(epcis) {
    for (const epci of epcis) {
        epci.properties.population = null;
        epci.properties.filterData = epci.properties.population;
        delete epci.properties.population;
    }
    return epcis;
}

// Parcourir chaque fichier dans le dossier
fichiers.forEach((fichier) => {
    if (path.extname(fichier) === '.json') {
        const cheminFichier = path.join(dossier, fichier);

        // Lire le fichier JSON
        const data = fs.readFileSync(cheminFichier, 'utf-8');
        const epcis = JSON.parse(data);

        // Appliquer les modifications
        const epcisModifie = selectedFilter(epcis);

        // Écrire le fichier JSON modifié
        const epcisJson = JSON.stringify(epcisModifie);
        fs.writeFileSync(cheminFichier, epcisJson, 'utf-8');

        console.log(`Modifications appliquées à ${fichier}`);
    }
});

console.log('Toutes les modifications ont été appliquées avec succès.');
