import React, { useState, useEffect } from "react";
import "./style.css";
import { formattedText, replaceText } from "../../../../scripts/scripts.js";
import { useMapContext } from "../../../MapContext.js";
import { useMessages } from '../../Layout/MessageContext';

function FormFilter() {

  const { setError } = useMessages();
  const { setSelectedFilter, selectedJob } = useMapContext();

  const [filters, setFilters] = useState([]);
  const [filterPraticien , setFilterPraticien] = useState([]);

  // UseEffect executé à l'initialisation pour récupérer les données des filtres EPCI
  useEffect(() => {
    // Fonction pour récupérer la liste des filtres EPCI depuis l'API
    const fetchFilters = async () => {
      try {
        // Retourne l'intitulé de tous les types de données relative aux EPCI de la BDD
        const response = await fetch(`${process.env.REACT_APP_API_DONNEES_URL}/api/epcis/libelle-liste`);
        const data = await response.json();
        setFilters(data);
      } catch (error) {
        setError("Erreur lors du chargement des filtres : " + error);
      }
    };

    fetchFilters();
    // Fonction pour récupérer la liste de tout les filtre praticiens depuis l'API
    const fetchFiltersPraticien = async () => {
      try {
        // Retourne la liste de tous les types de données relative aux praticiens de la BDD
        const response = await fetch(`${process.env.REACT_APP_API_DONNEES_URL}/api/praticiens-libelle-liste`);
        const data = await response.json();
        setFilterPraticien(data);
      } catch (error) {
        setError("Erreur lors du chargement des filtres : " + error)
      }
    };
    
    fetchFiltersPraticien();

  }, []); 


  return (
    <>
      <li className="px-4 mt-2">
        <label className="mb-2 fw-medium" id="filterLabel" htmlFor="filter">
          Choix du filtre
        </label>
        <select
          aria-labelledby="filterLabel"
          className="form-select my-2"
          id="filter"
          name="filter"
          onChange={(event) => {
            // Définir si le filtre sélectionné est un filtre simple ou un filtre relatif au praticien
            if (event.target.options.selectedIndex  >= filters.length - 2) {
              setSelectedFilter([2, event.target.value]);
            } else {
              setSelectedFilter([1, event.target.value]);
            }            
          }}
        >
          {filters.slice(2).map((filter, index) => (
            // Mapper sur le le tableau des filtre pour les afficher dans le select      
            <option key={index} value={filter.libelle}>
              {replaceText(formattedText(filter.libelle))} 
            </option>
          ))}
          {selectedJob && filterPraticien.filter(element => !element.categorie.includes("apl")).map((filter, index) => (
            // Ajouter les filtre propres au praticien si un praticien est selectionné
            <option key={index} value={filter.categorie}>
              {replaceText(formattedText(filter.categorie))}
            </option>
          ))}
        </select>
      </li>
    </>
  );
}

export default FormFilter;
