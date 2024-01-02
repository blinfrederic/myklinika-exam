import React, { useState } from "react";
import { useAuth } from "../../Layout/AuthProvider";
import { useMessages } from "../../Layout/MessageContext";

export function DeleteUser({ setPage }) {
    const { setError, setSuccess } = useMessages();
    const { logout } = useAuth();
    const [confirmation, setConfirmation] = useState(false);

    const handleDelete = async () => {
        setConfirmation(true);
    };

    const confirmDelete = async () => {
        const id = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_USER_URL}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                },
            });

            if (response.ok) {
                // Profil supprimé avec succès, définir un message de succès.
                
                setSuccess("Profil supprimé avec succès.");
                 logout();               
            } else {
                const errorMessage = await response.text(); // Récupérez le message d'erreur du serveur
                throw new Error(errorMessage);
            }
        } catch (error) {
            // En cas d'erreur lors de la requête, afficher un message d'erreur générique
            setError(error.message);
        }
    };

    return (
        <>
            <div className='flex gap-2'>
                {!confirmation && <button className="btn btn-outline-danger mb-2" type='button' onClick={handleDelete}>Supprimer le compte</button>}
                {confirmation && (
                    <>
                        <p>Êtes-vous sûr de vouloir supprimer votre profil ? Cette action est irréversible.</p>
                        <div className="d-flex gap-1 justify-content-center">
                            <button className="btn btn-danger" type='button' onClick={confirmDelete}>Oui, supprimer</button>
                            <button className="btn btn-secondary" type='button' onClick={() => setConfirmation(false)}>Annuler</button>
                        </div>

                    </>
                )}
            </div>

        </>
    );
}
