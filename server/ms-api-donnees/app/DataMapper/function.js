// Fonction pour parser les valeurs des catégories
export function parseCategoryValues(categories) {
    // Utilisation de la méthode map pour créer un nouveau tableau avec les valeurs modifiées
    return categories.map(category => {
        // Remplace les virgules par des points pour permettre la conversion en nombre
        const parsedValue = category.valeur.replace(',', '.');
        // Tente de convertir la valeur en nombre
        const parsedNumber = parseFloat(parsedValue);
        // Vérifie si la conversion en nombre a réussi et si le résultat est un nombre fini
        const isNumeric = !isNaN(parsedNumber) && isFinite(parsedNumber);
        // Retourne un nouvel objet avec la valeur mise à jour en nombre si possible, sinon en chaîne de caractères d'origine
        return {
            ...category,
            valeur: isNumeric ? parsedNumber : category.valeur
        };
    });
}

// Fonction pour parser les valeurs des praticiens
export function parsePraticienValues(praticien) {
    // Initialise un objet vide pour stocker les valeurs modifiées
    const parsedValeurs = {};

    // Parcourt toutes les propriétés de l'objet valeurs du praticien
    for (const key in praticien.valeurs) {
        // Vérifie si la propriété est propre à l'objet (évite les propriétés héritées)
        if (Object.prototype.hasOwnProperty.call(praticien.valeurs, key)) {
            // Remplace les virgules par des points pour permettre la conversion en nombre
            const value = praticien.valeurs[key].replace(',', '.');
            // Tente de convertir la valeur en nombre
            parsedValeurs[key] = !isNaN(parseFloat(value)) ? parseFloat(value) : praticien.valeurs[key];
        }
    }

    // Retourne un nouvel objet praticien avec les valeurs mises à jour
    return {
        ...praticien,
        valeurs: parsedValeurs
    };
}
