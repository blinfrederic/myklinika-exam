import "./InfoBulle.css"
import InfoZrr from "../InfoZrr/InfoZrr";
import InfoZonagePraticien from "../InfoZonagePraticien/InfoZonagePraticien";
import { useMapContext } from "../../../MapContext.js";



function InfoBulle () {
    // Fonction pour afficher dans l'infobulle toutes les informations relative a l'EPCI selectionné
    const {selectedEpciData, selectedJob} = useMapContext();

    if (selectedEpciData === "") {
        
        return(
            <div className="info__container">
                <h3>Informations</h3>
                <p>Selectionnez un EPCI</p>
            </div>
        )
    }
    
    else{
        return(
            <>
                <div className="info__container">
                    <h3 className="info__title">Informations</h3>
                    <p><span className="info__tag">Code EPCI :</span> {selectedEpciData[0].categories[0].valeur}</p>
                    <p><span className="info__tag">Nom :</span> {selectedEpciData[0].categories[1].valeur}</p>
                    <p><span className="info__tag">Nombre d'ald :</span> {selectedEpciData[0].categories[2].valeur}</p>
                    <p><span className="info__tag">Population :</span> {selectedEpciData[0].categories[3].valeur}</p>
                    <p><span className="info__tag">Nombre d'école maternelle :</span> {selectedEpciData[0].categories[4].valeur}</p>
                    <p><span className="info__tag">Nombre d'école primaire :</span> {selectedEpciData[0].categories[5].valeur}</p>
                    <p><span className="info__tag">Nombre de collége :</span> {selectedEpciData[0].categories[6].valeur}</p>
                    <p><span className="info__tag">Nombre de lycée :</span> {selectedEpciData[0].categories[7].valeur}</p>
                    <p><span className="info__tag">Taux d'équipement sportif et culturel :</span> {selectedEpciData[0].categories[8].valeur}</p>
                    <p><span className="info__tag">Nombre de commune :</span> {selectedEpciData[0].categories[9].valeur}</p>
                    <p><span className="info__tag">Nombre de maison de santé pluriprofessionnelle :</span> {selectedEpciData[0].categories[10].valeur}</p>
                </div>
                <InfoZrr codeEpci={selectedEpciData[0].categories[0].valeur} selectedJob={selectedJob} />
                <InfoZonagePraticien codeEpci={selectedEpciData[0].categories[0].valeur} selectedJob={selectedJob} />
            </>
        )
    }

}

















export default InfoBulle;




