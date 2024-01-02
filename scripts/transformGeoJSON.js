import dataEpciIDF from '../../data-epci/data-idf.json'
import dataEpciGrandEst from '../../data-epci/data-grand-est.json' 
import dataEpciBourgogneFrancheComte from '../../data-epci/bourgogne-franche-comte.json' 
import dataEpciCentreValDeLoire from '../../data-epci/centre-val-de-loire.json' 
import dataEpciAuvergneRhoneAlpes from '../../data-epci/auvergne-rhone-alpes.json' 
import dataEpciBretagne from '../../data-epci/bretagne.json' 
import dataEpciCorse from '../../data-epci/corse.json' 
import dataEpciNouvelleAquitaine from '../../data-epci/nouvelle-aquitaine.json' 
import dataEpciNormandie from '../../data-epci/normandie.json' 
import dataEpciOccitanie from '../../data-epci/occitanie.json' 
import dataEpciPaysDeLaLoire from '../../data-epci/pays-de-la-loire.json' 
import dataEpciPovenceAlpesCoteDazure from '../../data-epci/provence-alpes-cote-d-azure.json' 
import dataEpciHautsDeFrance from '../../data-epci/hauts-de-france.json' 

const epcis = [];

/* Formater les donnée en geoJSON valides, exemple :
    const validGeoJSON = {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    }; 
*/
dataEpciIDF.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciGrandEst.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciBourgogneFrancheComte.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciCentreValDeLoire.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciHautsDeFrance.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciAuvergneRhoneAlpes.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciBretagne.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciCorse.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciNormandie.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciNouvelleAquitaine.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciOccitanie.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciPaysDeLaLoire.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

dataEpciPovenceAlpesCoteDazure.forEach((epci) => {
    let type = 'Feature'

    let properties = {}
    properties.code = epci.code
    properties.nom = epci.nom
    properties.population = epci.population

    let geometry = epci.contour
    
    let formatedEpci = {
        type, properties, geometry
    }
    epcis.push(formatedEpci)
});

export default epcis;