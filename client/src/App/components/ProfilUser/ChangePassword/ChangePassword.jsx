import React, { useState } from "react";
import { useMessages } from "../../Layout/MessageContext";

export default function ChangePassword() {
    // Utilisation du hook useMessages pour gérer les messages d'erreur et de succès
    const { setError, setSuccess } = useMessages();
    // États locaux pour les champs de mot de passe et le mode d'édition
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Fonction pour gérer l'affichage/masquage du mot de passe
    const handleTogglePassword = (field) => {
        switch (field) {
            case 'oldPassword':
                setShowOldPassword(!showOldPassword);
                break;
            case 'newPassword':
                setShowNewPassword(!showNewPassword);
                break;
            case 'confirmPassword':
                setShowConfirmPassword(!showConfirmPassword);
                break;
            default:
                break;
        }
    };

    // Fonction pour gérer la soumission du formulaire de changement de mot de passe
    const handlePasswordChange = async (e) => {
        e.preventDefault();


        // Récupération de l'ID de l'utilisateur et du token depuis le stockage local
        const id = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        // Envoi de la requête de mise à jour du mot de passe au serveur
        try {
            const response = await fetch(`${process.env.REACT_APP_API_USER_URL}/users/${id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({
                    mot_de_passe: passwords.oldPassword,
                    confirm_mdp: passwords.newPassword,
                    nouveau_mdp: passwords.confirmPassword
                })
            });

            // Vérification de la réponse du serveur
            if (response.ok) {
                // En cas de succès, afficher un message de succès et réinitialiser les champs et le mode d'édition
                setSuccess('Mot de passe mis à jour avec succès.');
                setEditMode(false);
                setPasswords({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                const error = await response.json();
                setError(error);

            }
        } catch (error) {
            // Gérer les erreurs liées à la requête
            console.error('Erreur de réseau', error);
            setError(error.message);

        }
    };

    // Rendu du composant
    return (
        <div className="mb-3"> 
            {editMode ? (
                // Formulaire de changement de mot de passe en mode d'édition
                <form onSubmit={handlePasswordChange} className="row g-3">
                    {/* Champ pour l'ancien mot de passe */}
                    <div className="col-md-6">
                        <label htmlFor="oldpassword" className="form-label">Ancien mot de passe * :</label>
                        <div className="input-group">
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                className="form-control"
                                id="oldpassword"
                                value={passwords.oldPassword}
                                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                                required
                            />
                            {/* Bouton pour afficher/masquer l'ancien mot de passe */}
                            <i className={`fa-regular ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'} ms-2 my-auto p-1`} onClick={() => handleTogglePassword('oldPassword')} onKeyDown={() => handleTogglePassword('oldPassword')} tabIndex="0"></i>
                        </div>
                    </div>
                    {/* Champ pour le nouveau mot de passe */}
                    <div className="col-md-6">
                        <label htmlFor="newpassword" className="form-label">Nouveau mot de passe * :</label>
                        <div className="input-group">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className="form-control"
                                id="newpassword"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                required
                            />
                            {/* Bouton pour afficher/masquer le nouveau mot de passe */}
                            <i className={`fa-regular ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'} ms-2 my-auto p-1`} onClick={() => handleTogglePassword('newPassword')} onKeyDown={() => handleTogglePassword('newPassword')} tabIndex="0"></i>
                        </div>
                    </div>
                    {/* Champ pour la confirmation du nouveau mot de passe */}
                    <div className="col-md-6">
                        <label htmlFor="confirmpassword" className="form-label">Confirmer le mot de passe * :</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="form-control"
                                id="confirmpassword"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                required
                            />
                            {/* Bouton pour afficher/masquer la confirmation du nouveau mot de passe */}
                            <i className={`fa-regular ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} ms-2 my-auto p-1`} onClick={() => handleTogglePassword('confirmPassword')} onKeyDown={() => handleTogglePassword('confirmPassword')} tabIndex="0"></i>
                        </div>
                    </div>
                    {/* Boutons de soumission et d'annulation */}
                    <div className="col-12 mt-3">
                        <button type="submit" className="btn btn-primary me-2">Valider</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Annuler</button>
                    </div>
                </form>
            ) : (
                // Bouton pour activer le mode d'édition du mot de passe
                <button className="btn btn-outline-primary" onClick={() => setEditMode(true)}>Changer le mot de passe</button>
            )}
        </div>
    );
}
