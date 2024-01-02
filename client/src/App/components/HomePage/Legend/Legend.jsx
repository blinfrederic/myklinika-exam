import './Legend.css';
import { useMapContext } from "../../../MapContext.js";

function Legend (){
    const {selectedFilter, selectedJob} = useMapContext();
    let legend = []
    // Defini le contenu de la legende en fonction du filtre selectionné (partie filtres classique)
if(selectedFilter[0] === 1){
    switch (selectedFilter[1]) {
        case "nb_msp":
            legend = [
                {value : "plus de 10 maisons de santé", color : '#239B56'},
                {value : "entre 6 et 10 maisons de santé", color : '#2ECC71'},
                {value : "entre 1 et 5 maisons de santé", color : '#F1C40F'},
                {value : "1 et moins maisons de santé", color : '#C0392B'}
            ]            
            break;
        case "population":
            legend = [
                {value : "plus de 500k habitants", color : '#C0392B'},
                {value : "entre 100k et 500k habitants", color : '#E67E22'},
                {value : "entre 50k et 100k habitants", color : '#F1C40F'},
                {value : "10k et 50k habitants", color : '#2ECC71'},
                {value : "moins de 10k habitants", color : '#239B56'}
            ]          
            break;
        case "nb_commune":
            legend = [
                {value : "plus de 100 communes", color : '#C0392B'},
                {value : "entre 50 et 100 communes", color : '#E67E22'},
                {value : "entre 25 et 50 communes", color : '#F1C40F'},
                {value : "entre 10 et 25 communes", color : '#2ECC71'},
                {value : "moins de 10 communes", color : '#239B56'}
            ]            
            break;
        case "nb_ald":
            legend = [
                {value : "plus de 100k bénéf. en ALD", color : '#C0392B'},
                {value : "entre 20k et 100k bénéf. en ALD", color : '#E67E22'},
                {value : "entre 10k et 20k bénéf. en ALD", color : '#F1C40F'},
                {value : "entre 1k et 10k bénéf. en ALD", color : '#2ECC71'},
                {value : "1k et moins bénéf. en ALD", color : '#239B56'}
            ]            
            break;
        case "tx_equipement_sc":
            legend = [
                {value : "plus de 5 équ. pour 10k hab.", color : '#239B56'},
                {value : "entre 3 et 5 équ. pour 10k hab.", color : '#2ECC71'},
                {value : "entre 1 et 3 équ. pour 10k hab.", color : '#F1C40F'},
                {value : "entre 0,5 et 1 équ. pour 10k hab.", color : '#E67E22'},
                {value : "< 0,5 équ. pour 10k hab.", color : '#C0392B'}
            ]            
            break;
        case "nb_lycee":
        case "nb_college":
        case "nb_elementaire":
        case "nb_maternelle":
            legend = [
                {value : "plus de 20 établissements", color : '#2ECC71'},
                {value : "entre 10 et 20 établissements", color : '#F1C40F'},
                {value : "entre 1 et 10 établissements", color : '#E67E22'},
                {value : "aucun établissement", color : '#C0392B'}
            ]            
            break;    
        default:
            break;
    }
    // Defini le contenu de la legende en fonction du filtre selectionné (partie filtres des praticiens)
    } else if (selectedFilter[0] === 2) {
            if (selectedFilter[1] === "evolution_sur_5_ans") {
                legend = [
                    {value : "augmentation de plus de 10 praticiens", color : '#2ECC71'},
                    {value : "augmentation entre 1 et 10 praticiens", color : '#2ECC71'},
                    {value : "aucun changement", color : '#F1C40F'},
                    {value : "diminution entre 1 et 10 praticiens", color : '#E67E22'},
                    {value : "diminution de plus de 10 praticiens", color : '#C0392B'}
                ] 

            } else if (selectedFilter[1] === "nombre_de_praticiens" && (
                        selectedJob.includes("generaliste") 
                        || selectedJob.includes("infirmier") 
                        || selectedJob.includes("masseur_kine")
                        )) {

                            legend = [
                                {value : "Densité > 500 pour 100K habitants", color : '#239B56'},
                                {value : "Densité entre 250 et 500 pour 100K habitants", color : '#2ECC71'},
                                {value : "Densité entre 100 et 250 pour 100K habitants", color : '#F1C40F'},
                                {value : "Densité entre 50 et 100 pour 100K habitants", color : '#E67E22'},
                                {value : "Densité < 50 pour 100K habitants", color : '#C0392B'}
                            ] 

            } else if (selectedFilter[1] === "nombre_de_praticiens" && (
                        selectedJob.includes("ophtalmologue") 
                        || selectedJob.includes("orthoptiste") 
                        ||selectedJob.includes("sage_femme")
                        ||selectedJob.includes("pediatre")
                        ||selectedJob.includes("neurologue")
                        ||selectedJob.includes("ORL")                       
                        )) {

                            legend = [
                                {value : "Densité > 150 pour 100K habitants", color : '#2ECC71'},
                                {value : "Densité entre 50 et 150 pour 100K habitants", color : '#F1C40F'},
                                {value : "Densité entre 30 et 50 pour 100K habitants", color : '#E67E22'},
                                {value : "Densité entre 10 et 30 pour 100K habitants", color : '#E67E22'},
                                {value : "Densité < 10 pour 100K habitants", color : '#C0392B'}
                            ] 

            } else if (selectedFilter[1] === "nombre_de_praticiens") {

                legend = [
                    {value : "Densité > 150 pour 100K habitants", color : '#239B56'},
                    {value : "Densité entre 50 et 150 pour 100K habitants", color : '#2ECC71'},
                    {value : "Densité entre 30 et 50 pour 100K habitants", color : '#F1C40F'},
                    {value : "Densité entre 10 et 30 pour 100K habitants", color : '#E67E22'},
                    {value : "Densité < 10 pour 100K habitants", color : '#C0392B'}
                ] 
            }
            
        }
    
    return(
        <div className="legend">
            <h3 className="legend_title">Légende</h3>
            <ul>
                {legend.map((element, index) => (
                    //Map sur chaque element de legende et l'affiche
                    <li key={index} className='legend_content'>
                        <div className="color" style={{backgroundColor: element.color}}></div>
                        <div className="value">{element.value}</div>
                    </li>
                ))}
            </ul>
        </div>
        
    )
};



export default Legend;