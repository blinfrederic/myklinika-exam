import React, { useEffect } from "react";
import "./style.css";
import { formattedText } from "../../../../scripts/scripts.js";
import { useMapContext } from "../../../MapContext.js";

function FormJob() {

  const { jobsList, setJobsList, setSelectedJob } = useMapContext();

  // UseEffect executé à l'initialisation pour récupérer la liste des praticiens
  useEffect(() => {
    // Fonction pour récupérer la liste des types de praticien depuis l'API
    const fetchFilters = async () => {
      try {
        // Retourne l'intitulé de tous les types de praticien de la BDD
        const response = await fetch(`${process.env.REACT_APP_API_DONNEES_URL}/api/praticiens-liste`);
        const data = await response.json();
        setJobsList(data);
      } catch (error) {
        console.error("Erreur lors du chargement des filtres :", error);
      }
    };

    fetchFilters();
  }, [setJobsList]);

  // Set SelectedJob au clic dans le select
  const handleJobChange = (event) => {
    setSelectedJob(event.target.value);
  };

  return (
    <li className="px-4 mt-2">

      <label className="mb-2 fw-medium" id="filterLabel" htmlFor="filterJob">
        Choix du praticien
      </label>
      <select
        aria-labelledby="filterLabel"
        className="form-select my-2"
        id="filterJob"
        name="filterJob"
        onChange={handleJobChange}
      >
        {jobsList.map((profession, index) => (
          //Mapper sur la liste des praticiens pour les afficher dans le select
          <option
            key={index}
            value={profession.libelle}>
            {formattedText(profession.libelle)}
          </option>
        ))}
      </select>
    </li>

  );
}


export default FormJob;

