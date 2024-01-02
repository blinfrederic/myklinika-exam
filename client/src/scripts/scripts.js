export function formattedText(profession) {
    return profession.charAt(0).toUpperCase() + profession.slice(1).replaceAll("_", " ")
}

export function limiterMot(mot, limite) {
    if (mot.length > limite) {
        return mot.slice(0, limite) + "...";
    }
    return mot;
}

export function replaceText(text) {
    // .replace("Nb", "Nombre").replace("Tx", "Taux").replace("sc", "sportif et culturel")
    return text.replace("Nb", "Nombre").replace("Tx", "Taux").replace("sc", "sportif et culturel")
}