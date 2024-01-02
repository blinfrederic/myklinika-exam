import React, { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
    const [selectedFilter, setSelectedFilter] = useState([1, "nb_ald"]);
    const [selectedJob, setSelectedJob] = useState("dentiste");
    const [jobsList, setJobsList] = useState([]);
    const [loadingMap, setLoadingMap] = useState(false);
    const [epcisData, setEpcisData] = useState(null);
    const [selectedEpciData, setSelectedEpciData] = useState("");

    return (
        <MapContext.Provider
            value={{
                selectedFilter,
                setSelectedFilter,
                selectedJob,
                setSelectedJob,
                jobsList,
                setJobsList,
                loadingMap,
                setLoadingMap,
                epcisData,
                setEpcisData,
                selectedEpciData,
                setSelectedEpciData,
            }}
        >
            {children}
        </MapContext.Provider>
    );
};

export const useMapContext = () => {
    return useContext(MapContext);
};
