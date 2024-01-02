import React, { useEffect } from "react";
import { useMapContext } from "../../../MapContext.js";
import FormJob from "../FormJob/FormJob";
import FormFilter from "../Formfilter/Formfilter";
// import Publicite from "../Publicite/Publicite";
import Map from "../Map/Map.jsx"
import Loading from '../../Loading/Loading';
import Legend from "../Legend/Legend";

import "./MapPage.css";
import InfoBulle from "../InfoBulle/InfoBulle";
import { useMessages } from '../../Layout/MessageContext';

export default function MapPage() {
  const { errorMessage } = useMessages();

  const {
    loadingMap,
    setLoadingMap,
    setEpcisData,
  } = useMapContext();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const metroData = await import('../../../../data-epci/epcis_metro.json');
        const guadeloupeData = await import('../../../../data-epci/epcis_guadeloupe.json');
        const guyaneData = await import('../../../../data-epci/epcis_guyane.json');
        const martiniqueData = await import('../../../../data-epci/epcis_martinique.json');
        const reunionData = await import('../../../../data-epci/epcis_reunion.json');
        const mayotteData = await import('../../../../data-epci/epcis_mayotte.json');

        setEpcisData({
          metro: metroData.default,
          guadeloupe: guadeloupeData.default,
          guyane: guyaneData.default,
          martinique: martiniqueData.default,
          reunion: reunionData.default,
          mayotte: mayotteData.default,
        });
        setLoadingMap(true);
      } catch (error) {
        console.error('Erreur lors du chargement des données epci :', error);
        setLoadingMap(false);
      }
    };

    fetchData();
  }, [setEpcisData, setLoadingMap]);

  return (
    <div>
      {loadingMap ? (
        <>
          <div className="app__container" >

            <div className="app__legends">
              <div className="mapPage__error">
                {errorMessage && <p className='error__message'>{errorMessage}</p>}
              </div>
              <div className="d-md-flex flex-lg-column">
                <div className="container-fluid">
                  <div className="navbar-nav flex-md-row">
                    <div className="app_filter">
                      <FormJob />
                      <FormFilter />
                    </div>
                    <Legend />
                  </div>
                </div>
              </div>
              <InfoBulle />
            </div>
            <div className="app__map">
              <Map />
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
