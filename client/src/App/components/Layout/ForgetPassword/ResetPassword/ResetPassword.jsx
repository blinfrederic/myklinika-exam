import React, { useState } from 'react';
import { useMessages } from '../../MessageContext';
export function ResetPassword() {
    const { errorMessage, setError, successMessage, setSuccess } = useMessages();
    const [nouveauMdp, setNouveauMdp] = useState('');
    const [confirmMdp, setConfirmMdp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // activer ou desactiver la vue du mot de passe
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    // activer ou desactiver la vue de la confirmation du mot de passe
    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleNouveauMdpChange = (event) => {
        setNouveauMdp(event.target.value);
    }

    const handleConfirmMdpChange = (event) => {
        setConfirmMdp(event.target.value);
    }

    const token = window.location.pathname.split('/resetpassword/')[1];

    const handleSubmit = async (event) => {
        event.preventDefault();


        try {
            const response = await fetch(`http://localhost:3003/resetFormPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    nouveau_mdp: nouveauMdp,
                    confirm_mdp: confirmMdp
                }),
            });

            if (response.ok) {
                await response.json();
                setNouveauMdp('');
                setConfirmMdp('');
                window.location = '/';
                setSuccess("Votre mot de passe a bien été modifié ! Vous pouvez vous connecter avec votre nouveau mot de passe.")
            } else {
                // Gestion de l'erreur si la requête échoue
                const errorMessage = await response.text(); // Récupérez le message d'erreur du serveur
                throw new Error(errorMessage); // Utilisez le message d'erreur renvoyé par le serveur
            }
        } catch (error) {
            setError(error.message); // Affichez l'erreur dans la console
        }
    };
    // utiliser handleTogglePassword lors de l'enfoncement de la touche Enter sur les icons
    const handleEnterKeyPassword = (event) => {
        if (event.keyCode === 13) {
            handleTogglePassword()
        }
    }
    // utiliser handleToggleConfirmPassword lors de l'enfoncement de la touche Enter sur les icons
    const handleEnterKeyConfirmPassword = (event) => {
        if (event.keyCode === 13) {
            handleToggleConfirmPassword()
        }
    }

    return (
        <div className='fPassword__block'>
            <div className='fPassword'>
                <h1 className="fPassword__title">Récupération de mot de passe</h1>
                {successMessage && <div className='success__message'>{successMessage}</div>}
                {errorMessage && <div className='error__message'>{errorMessage}</div>}
                <form className='fPassword__form' onSubmit={handleSubmit}>
                    <div className='fPassword__email'>
                        <label htmlFor='nouveauMdp'>Nouveau mot de passe :</label>
                        <input className="fPassword__input" name="nouveauMdp" type={showPassword ? "text" : "password"} id='nouveauMdp' value={nouveauMdp} onChange={handleNouveauMdpChange} required />
                        <div tabIndex={0} onKeyUp={handleEnterKeyPassword}>
                            {
                                showPassword ?
                                    <i className="fa-regular fa-eye-slash" onClick={handleTogglePassword}></i>
                                    :
                                    <i className="fa-regular fa-eye" onClick={handleTogglePassword}></i>
                            }
                        </div>
                    </div>

                    <div className='fPassword__email'>
                        <label htmlFor='confirmMdp'>Confirme mot de passe :</label>
                        <input className="fPassword__input" name="confirmMdp" type={showConfirmPassword ? "text" : "password"} id='confirmMdp' value={confirmMdp} onChange={handleConfirmMdpChange} required />
                        <div tabIndex={0} onKeyUp={handleEnterKeyConfirmPassword}>
                            {
                                showConfirmPassword ?
                                    <i className="fa-regular fa-eye-slash" onClick={handleToggleConfirmPassword}></i>
                                    :
                                    <i className="fa-regular fa-eye" onClick={handleToggleConfirmPassword}></i>
                            }
                        </div>
                    </div>

                    <button type="submit" className='fPassword__submit'>
                        Changer de mot de passe
                    </button>
                </form>
            </div>
            <div className='fPassword__bg'></div>
        </div>
    );
}
