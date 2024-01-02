import fs from 'fs';
import path from 'path';

const inputFolderPath = './epci';
const outputFolderPath = './formatted-epci'; // Chemin du dossier de destination

// Lire la liste des fichiers dans le dossier source
const files = fs.readdirSync(inputFolderPath);

// Assurez-vous que le dossier de destination existe, sinon, créez-le
if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
}

// Boucler sur chaque fichier JSON dans le dossier source
files.forEach(file => {
    const inputFilePath = path.join(inputFolderPath, file);

    // Vérifier si le fichier a l'extension .json
    if (path.extname(file) === '.json') {
        // Lire le fichier JSON
        const jsonData = fs.readFileSync(inputFilePath, 'utf-8');

        try {
            // Parser le fichier JSON
            const dataEpciIDF = JSON.parse(jsonData);

            let formattedEpcis = [];

            dataEpciIDF.forEach((epci) => {
                let type = 'Feature';

                let properties = {};
                properties.code = epci.code;
                properties.nom = epci.nom;
                properties.population = epci.population;

                let geometry = epci.contour;

                let formatedEpci = {
                    type, properties, geometry
                };

                formattedEpcis.push(formatedEpci);
            });

            // Convertir l'objet en chaîne JSON
            const formattedJsonData = JSON.stringify(formattedEpcis);

            // Écrire les données JSON dans un fichier dans le dossier de destination
            const outputFilePath = path.join(outputFolderPath, `formatted_${file}`);
            fs.writeFileSync(outputFilePath, formattedJsonData, 'utf-8');

            console.log(`Fichier ${file} traité avec succès.`);
        } catch (error) {
            console.error(`Erreur lors du traitement du fichier ${file} :`, error);
        }
    }
});
