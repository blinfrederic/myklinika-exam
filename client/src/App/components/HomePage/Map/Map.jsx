import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { useMapContext } from "../../../MapContext.js";
import { useMessages } from '../../Layout/MessageContext';

import './Map.css'

function Map() {
    const { setError } = useMessages();
    const { selectedFilter, selectedJob, epcisData, setSelectedEpciData } = useMapContext();
    const [dataFromApi, setDataFromApi] = useState(null);

    // UseEffect executé au changement de filtre, au changement de praticien ou au changement de setError
    useEffect(() => {
        // Recupere tous les EPCI + l'info selectionné dans le filtre pour chaque EPCI depuis l'API (si filtre simple selectionné)
        if (selectedFilter[0] === 1) {
            const getDataFromApi = async () => {
                const response = await fetch(`${process.env.REACT_APP_API_DONNEES_URL}/api/epcis/libelle/${selectedFilter[1]}`);
                const data = await response.json();
                setDataFromApi(data);
            }
            getDataFromApi();
        }
        // Recupere tous les EPCI + l'info selectionné dans le filtre pour chaque EPCI depuis l'API (si filtre praticien selectionné)
        else if (selectedFilter[0] === 2) {
            const getDataFromApi = async () => {
                const response = await fetch(`${process.env.REACT_APP_API_DONNEES_URL}/api/praticien/${selectedJob}/${selectedFilter[1]}`);
                const data = await response.json();
                setDataFromApi(data);
                if (selectedFilter[1] === "evolution_sur_5_ans" && (selectedJob === "ergotherapeute" || selectedJob === "pediatre" || selectedJob === "neurologue" || selectedJob === "ORL" || selectedJob === "podologue" || selectedJob === "psychomotricien")) {
                    setError("Pas de données disponibles pour ce filtre")
                }
            }
            getDataFromApi();
        }
        // eslint-disable-next-line
    }, [selectedFilter, selectedJob]);

    // Distribue les informations récuprées de l'API dans le polygone leaflet correspondant (liés par le code EPCI)
    function splitEpcis(epcis) {
        //Compare les code EPCI des objets de dataFromApi et epcis
        epcis.forEach(element => {
            if (dataFromApi && dataFromApi.length > 0) {
                let foundEpciCode = dataFromApi.find(epci => epci.id_code_epci === element.properties.code)
                //A chaque correspondence trouvée, copie la valeur de la donnée API le polygone leaflet
                if (selectedFilter[0] === 2) {
                    element.properties.filterData = foundEpciCode.totalValeurPraticien
                } else {
                    element.properties.filterData = foundEpciCode.valeur
                }
            }
        })
        return epcis
    }

    // Une fonction de colorisation par filtre (ou presque)

    function getColorScolaire(data) {
        return data > 20 ? '#2ECC71' : data > 10 ? '#F1C40F' : data > 0 ? '#E67E22' : '#C0392B'
    }

    function getColorAld(data) {
        return data > 100000 ? '#C0392B' : data > 20000 ? '#E67E22' : data > 10000 ? '#F1C40F' : data > 1000 ? '#2ECC71' : '#239B56'
    }

    function getColorTxSportCulture(data) {
        return data > 5 ? '#239B56' : data > 3 ? '#2ECC71' : data > 1 ? '#F1C40F' : data > 0.5 ? '#E67E22' : '#C0392B'
    }

    function getColorMsp(data) {
        return data > 10 ? '#239B56' : data > 5 ? '#2ECC71' : data > 1 ? '#F1C40F' : '#C0392B'
    }


    function getColorNbCommunes(data) {
        return data > 100 ? '#C0392B' : data > 50 ? '#E67E22' : data > 25 ? '#F1C40F' : data > 10 ? '#2ECC71' : '#239B56'
    }

    function getColorPopulation(data) {
        return data > 500000 ? '#C0392B' : data > 100000 ? '#E67E22' : data > 50000 ? '#F1C40F' : data > 10000 ? '#2ECC71' : '#239B56'
    }

    function getColorEvolution(data) {
        return data > 10 ? '#239B56' : data > 0 ? '#2ECC71' : data === 0 ? '#F1C40F' : data > -10 ? '#E67E22' : '#C0392B'
    }

    function getColorDensiteHaute(data) {
        return data > 500 ? '#239B56' : data > 250 ? '#2ECC71' : data > 100 ? '#F1C40F' : data > 50 ? '#E67E22' : '#C0392B'
    }

    function getColorDensiteMoyenne(data) {
        return data > 150 ? '#239B56' : data > 50 ? '#2ECC71' : data > 30 ? '#F1C40F' : data > 10 ? '#E67E22' : '#C0392B'
    }

    function getColorDensiteBasse(data) {
        return data > 20 ? '#239B56' : data > 10 ? '#2ECC71' : data > 5 ? '#F1C40F' : data > 1 ? '#E67E22' : '#C0392B'
    }

    //Defini le style pour les polygones de Leaflet
    const style = (feature) => {
        let fillColor = "";
        //pour les filtres simple
        if (selectedFilter[0] === 1) {
            switch (selectedFilter[1]) {
                case "nb_msp":
                    fillColor = getColorMsp(feature.properties.filterData);
                    break;
                case "population":
                    fillColor = getColorPopulation(feature.properties.filterData);
                    break;
                case "nb_commune":
                    fillColor = getColorNbCommunes(feature.properties.filterData);
                    break;
                case "nb_ald":
                    fillColor = getColorAld(feature.properties.filterData);
                    break;
                case "tx_equipement_sc":
                    fillColor = getColorTxSportCulture(feature.properties.filterData);
                    break;
                case "nb_lycee":
                case "nb_college":
                case "nb_elementaire":
                case "nb_maternelle":
                    fillColor = getColorScolaire(feature.properties.filterData);
                    break;
                default:
                    break;
            }
        }
        //pour les filtre praticiens
        else if (selectedFilter[0] === 2) {
            if (selectedFilter[1] === "evolution_sur_5_ans") {
                fillColor = getColorEvolution(feature.properties.filterData);

            } else if (selectedFilter[1] === "nombre_de_praticiens" && (
                selectedJob.includes("generaliste")
                || selectedJob.includes("infirmier")
                || selectedJob.includes("masseur_kine")
            )) {

                fillColor = getColorDensiteHaute(feature.properties.filterData);

            } else if (selectedFilter[1] === "nombre_de_praticiens" && (
                selectedJob.includes("ophtalmologue")
                || selectedJob.includes("orthoptiste")
                || selectedJob.includes("sage_femme")
                || selectedJob.includes("pediatre")
                || selectedJob.includes("neurologue")
                || selectedJob.includes("ORL")
            )) {

                fillColor = getColorDensiteBasse(feature.properties.filterData);

            } else if (selectedFilter[1] === "nombre_de_praticiens") {

                fillColor = getColorDensiteMoyenne(feature.properties.filterData);
            }

        }

        return {
            fillColor: fillColor,
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    //Définir l'EPCI selectionné
    async function updateInfoSelectedEpci(event) {
        const layer = event.target;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_DONNEES_URL}/api/epci/${layer.feature.properties.code}`);
            const data = await response.json();
            setSelectedEpciData(data);
        } catch (error) {
            console.error("Erreur lors du chargement des EPCI :", error);
        }
    }

    //Utiliser les fonctions sur les polygones Leaflet 
    function onEachFeature(feature, layer) {

        layer.on({
            click: updateInfoSelectedEpci
        });
    }


    const maxBounds = [
        [39.5, -7],
        [52, 10]
    ];

    return (
        <>

            <div className='map_allmaps'>

                {epcisData && epcisData.metro && (
                    <MapContainer className='map' center={[46.7111, 1.7191]} zoom={6} minZoom={6} maxZoom={10} scrollWheelZoom={true} maxBounds={maxBounds}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> France metropolitaine'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <GeoJSON data={splitEpcis(epcisData.metro)} style={style} onEachFeature={onEachFeature} />
                    </MapContainer>
                )}

                <div className='map_dom'>

                    {epcisData && epcisData.guadeloupe && (
                        <MapContainer className='map_guadeloupe' center={[16.17, -61.50]} zoom={8} minZoom={8} maxZoom={10} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='Guadeloupe'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <GeoJSON data={splitEpcis(epcisData.guadeloupe)} style={style} onEachFeature={onEachFeature} />
                        </MapContainer>
                    )}

                    {epcisData && epcisData.martinique && (
                        <MapContainer className='map_martinique' center={[14.63, -61.01]} zoom={8} minZoom={8} maxZoom={10} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='Martinique'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <GeoJSON data={splitEpcis(epcisData.martinique)} style={style} onEachFeature={onEachFeature} />
                        </MapContainer>
                    )}

                    {epcisData && epcisData.guyane && (
                        <MapContainer className='map_guyane' center={[4, -52.99]} zoom={5} minZoom={5} maxZoom={10} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='Guyane'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <GeoJSON data={splitEpcis(epcisData.guyane)} style={style} onEachFeature={onEachFeature} />
                        </MapContainer>
                    )}

                    {epcisData && epcisData.reunion && (
                        <MapContainer className='map_reunion' center={[-21.13, 55.53]} zoom={8} minZoom={8} maxZoom={10} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='Reunion'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <GeoJSON data={splitEpcis(epcisData.reunion)} style={style} onEachFeature={onEachFeature} />
                        </MapContainer>
                    )}

                    {epcisData && epcisData.mayotte && (
                        <MapContainer className='map_mayotte' center={[-12.84, 45.15]} zoom={9} minZoom={8} maxZoom={10} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='Mayotte'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <GeoJSON data={splitEpcis(epcisData.mayotte)} style={style} onEachFeature={onEachFeature} />
                        </MapContainer>
                    )}
                </div>
            </div>
        </>
    )
};

export default Map;