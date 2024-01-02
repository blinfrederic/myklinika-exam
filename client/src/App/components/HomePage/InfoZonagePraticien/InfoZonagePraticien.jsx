import React, { useState, useEffect } from 'react';
import './InfoZonagePraticien.css'


function InfoZonagePraticien({ codeEpci, selectedJob }) {

    const [responseZonagePraticien, setResponseZonagePraticien] = useState("");

    // Fonction pour récupérer le zonage medecin de l'EPCI selectionné en fonction du praticien selectionné
    const fetchZonnagePraticien = async () => {
        try {
            // Retourne La liste des villes et leur zonage pour l'EPCI selectionné et le pratitien selectionné
            const response = await fetch(`${process.env.REACT_APP_API_DONNEES_URL}/api/epci/communes/${codeEpci}/zonage_${selectedJob}/`);
            const data = await response.json();
            setResponseZonagePraticien(data);
        }
        catch (error) {
            console.log(error);
        }
    }
    // UseEffect executé au clic sur un EPCI ou au changement du filtre praticien
    useEffect(() => {
        fetchZonnagePraticien();
        // eslint-disable-next-line
    }, [codeEpci, selectedJob])


    if (responseZonagePraticien && (selectedJob === "generaliste" || selectedJob === "infirmier" || selectedJob === "masseur_kine" || selectedJob === "dentiste" || selectedJob === "orthophoniste" || selectedJob === "sage_femme")) {
        return (
            <div>
                <div className='info-zonage'>

                    <p className='info-zonage__title'>Zonage par villes :</p>
                    <div className="info-zonage__elements">
                        {responseZonagePraticien.length >= 1 && responseZonagePraticien[0].communes.map((item, index) => {
                            //Map sur toutes les villes de responseZonagePraticien et affiche la valeur
                            return (
                                <p key={index} className='info-zonage__element'>{item.nom_commune} : <span className="info-zonage__value ">{item.valeur}</span> </p>
                            )
                        }
                        )}
                    </div>
                </div>
            </div>

        );
    }
}

export default InfoZonagePraticien;