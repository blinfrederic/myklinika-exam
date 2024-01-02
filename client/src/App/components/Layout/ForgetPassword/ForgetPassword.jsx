import React, { useState } from 'react';
import './ForgetPassword.css';
import { useMessages } from '../MessageContext';

export const ForgetPassword = ({ setDisplayForm }) => {
    const { errorMessage, setError, successMessage, setSuccess } = useMessages();
    const [email, setEmail] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleClickToLogin = () => {
        setDisplayForm("login");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${process.env.REACT_APP_API_USER_URL}/resetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                const data = await response.json();
                setEmail('');
                setSuccess(data.message);

            } else {
                setError("Erreur lors de la réinitialisation du mot de passe");
                // Afficher un message d'erreur ou rediriger l'utilisateur vers une page d'erreur si la demande échoue
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
            setError("Erreur lors de la requête :", error);
        }
    };

    return (
        <div className='fPassword__block'>
            <div className='fPassword'>
                <h1 className="fPassword__title">Récupération de mot de passe</h1>
                {successMessage && <div className='success__message'>{successMessage}</div>}
                {errorMessage && <div className='error__message'>{errorMessage}</div>}
                <form className='fPassword__form' onSubmit={handleSubmit}>
                    <div className='fPassword__email'>
                        <label htmlFor='email'>Email</label>
                        <input className="fPassword__input" name="email" type="email" id='email' value={email} onChange={handleEmailChange} required />
                    </div>
                    <button className='fPassword__submit'>
                        Changer de mot de passe
                    </button>
                    <div className='fPassword__links'>
                        <button className='fPassword__link' onClick={handleClickToLogin}>Retourner à la connexion</button>
                    </div>
                </form>
            </div>
            <div className='fPassword__bg'></div>
        </div>
    );
};
