import React, { useState, useEffect } from 'react';
import './InfoZrr.css'

function InfoZrr({ codeEpci, selectedJob }) {

    const [responseZrr, setResponseZrr] = useState("")
    // Fonction pour récupérer le zonage medecin de l'EPCI selectionné en fonction du praticien selectionné
    const fetchZrr = async () => {
        // Retourne La liste des villes et le zonage ZRR pour l'EPCI selectionné
        const response = await fetch(`${process.env.REACT_APP_API_DONNEES_URL}/api/epci/communes/${codeEpci}/zrr_simp/`);
        const data = await response.json();
        setResponseZrr(data);
    }
    // UseEffect executé au clic sur un EPCI
    useEffect(() => {
        fetchZrr();
        // eslint-disable-next-line
    }, [codeEpci])


    const infoZrr = document.querySelector(".info-zrr");
    const infoZonage = document.querySelector(".info-zonage");
    const buttonZrr = document.querySelector(".btn__info-zrr");
    const buttonZonage = document.querySelector(".btn__info-zonage");

    //Afficher ou masquer les contenu de zonages au clic et masquer l'autre zonage si deja affiché
    const handleClick = () => {
        if (infoZrr.style.display === "none") {
            buttonZrr.innerText = "Masquer les villes classées en ZRR";
            infoZrr.style.display = "block";
            buttonZrr.classList.add("active")
            if (infoZonage) {
                infoZonage.style.display = "none"
                buttonZonage.innerText = "Afficher les zonages par villes"
                buttonZonage.classList.remove("active")
            }
        } else {
            buttonZrr.innerText = "Afficher les villes classées en ZRR"
            buttonZrr.classList.remove("active")
            infoZrr.style.display = "none"
            buttonZonage.classList.remove("active")
        };
    }

    const handleClick2 = () => {
        if (!selectedJob) {
            const errorDiv = document.querySelector("#errorMessage")
            errorDiv.textContent = "Veuillez selectionner un praticien"
            setTimeout(function () {
                errorDiv.textContent = ""
            }, 2000);
        } else {

            if (infoZonage && infoZonage.style.display === "none") {
                infoZonage.style.display = "block"
                buttonZonage.innerText = "Masquer les zonages par villes"
                buttonZonage.classList.add("active")
                infoZrr.style.display = "none"
                buttonZrr.innerText = "Afficher les villes classées en ZRR"
                buttonZrr.classList.remove("active")

            } else if (infoZonage) {
                infoZonage.style.display = "none"
                buttonZonage.innerText = "Afficher les zonages par villes"
                buttonZonage.classList.remove("active")

            };
        }

    }

    return (
        <div>
            <button className='btn__info-zrr ms-2 mt-2' onClick={handleClick}>Afficher les villes classées en ZRR</button>
            <button type="button" className='btn__info-zonage ms-2 mt-2' onClick={handleClick2}>Afficher les zonages par villes</button>
            <div id='errorMessage'></div>
            <div className='info-zrr'>
                <p className='info-zrr__title'>Villes classées en ZRR :</p>
                <div className='info-zrr__elements'>

                    {responseZrr && responseZrr[0].communes.map((item, index) => {
                        // Map sur toutes les villes de response zrr et affiche celles qui ont un sonage défini
                        if (item.valeur !== "NC - Commune non classée") {
                            return (
                                <p key={index} className='info-zrr__element'>{item.nom_commune}</p>
                            )
                        } else {
                            return null;
                        }
                    })}

                </div>
            </div>


        </div>

    );
}

export default InfoZrr;