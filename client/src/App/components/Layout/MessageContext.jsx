import React, { createContext, useContext, useState } from 'react';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const setError = (message) => {
        setErrorMessage(message);
        // Supprimez le message d'erreur après 5 secondes
        setTimeout(() => {
            setErrorMessage(null);
        }, 5000);
    };

    const setSuccess = (message) => {
        setSuccessMessage(message);
        // Supprimez le message de succès après 5 secondes
        setTimeout(() => {
            setSuccessMessage(null);
        }, 5000);
    };

    const clearMessages = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    return (
        <MessageContext.Provider
            value={{
                errorMessage,
                setError,
                clearMessages,
                successMessage,
                setSuccess,
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};

export const useMessages = () => {
    return useContext(MessageContext);
};
