import React, { useState } from 'react';
import { useMessages } from '../MessageContext';
import './SignInForm.css';

function SignInForm({ setDisplayForm, setPage }) {
    const { errorMessage, setError, setSuccess } = useMessages();

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        mot_de_passe: '',
        confirm_mdp: '',
        profession: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // récupérer les données du formulaire dans un objet
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // activer ou desactiver la vue du mot de passe
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };
    // activer ou desactiver la vue de la confirmation du mot de passe
    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            const response = await fetch(`${process.env.REACT_APP_API_USER_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // L'utilisateur a été enregistré avec succès
                setSuccess('Inscription réussie, vous avez reçu un email de confirmation');
                setDisplayForm('login');

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
    // Retourner sur l'afficahge de Login
    const handleClickToLogin = (event) => {
        event.preventDefault();
        setDisplayForm('login');
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
        <div className='signinform'>
            <div className='left'>
                <h2 className='signinform__title'>Inscription</h2>
                <p>Tous les champs sont obligatoire</p>
                {errorMessage && errorMessage.errors && errorMessage.errors.map((error, index) => {
                    return (
                        <p key={index} className='signinform__error'>{error ? error : errorMessage}</p>
                    )
                })}
                <form onSubmit={handleSubmit}>
                    <div className='signinform__names'>
                        <span className='signinform__element'>
                            <label htmlFor='name' className='signinform__label'>Nom :</label>
                            <input id='name' className='signinform__input' type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                        </span>
                        <span>
                            <label htmlFor='firstname' className='signinform__label'>Prénom :</label>
                            <input id='firstname' className='signinform__input' type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                        </span>
                    </div>
                    <div className='signinform__infos'>
                        <div>
                            <label htmlFor='phone' className='signinform__label'>Téléphone :</label>
                            <input id='phone' className='signinform__input' type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />

                        </div>
                        <div>
                            <label htmlFor='job' className='signinform__label'>Profession :</label>
                            <input id='job' className='signinform__input' type="text" name="profession" value={formData.profession} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor='email' className='signinform__label'>Email :</label>
                        <input id='email' className='signinform__input' type="email" name="email" value={formData.email} onChange={handleChange} required />

                    </div>
                    <div>
                        <label htmlFor='password' className='signinform__label'>Mot de passe :</label>
                        <div className='signinform__password'>
                            <input
                                className='signinform__input'
                                id='password'
                                type={showPassword ? "text" : "password"}
                                name="mot_de_passe"
                                value={formData.mot_de_passe}
                                onChange={handleChange}
                                required
                            />
                            <div className='signinform__icons' tabIndex={0} onKeyUp={handleEnterKeyPassword}>
                                {
                                    showPassword ?
                                        <i className="fa-regular fa-eye-slash" onClick={handleTogglePassword}></i>
                                        :
                                        <i className="fa-regular fa-eye" onClick={handleTogglePassword}></i>
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor='confirmPassword' className='signinform__label'>Confirmer le mot de passe :</label>
                        <div className='signinform__password'>
                            <input
                                className='signinform__input'
                                id='confirmPassword'
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_mdp"
                                value={formData.confirm_mdp}
                                onChange={handleChange}
                                required
                            />
                            <div className='signinform__icons' tabIndex={0} onKeyUp={handleEnterKeyConfirmPassword}>
                                {
                                    showConfirmPassword ?
                                        <i className="fa-regular fa-eye-slash" onClick={handleToggleConfirmPassword}></i>
                                        :
                                        <i className="fa-regular fa-eye" onClick={handleToggleConfirmPassword}></i>
                                }
                            </div>
                        </div>
                    </div>
                    <button className='signinform__button' type="submit">S'inscrire</button>
                </form>
                <button onClick={handleClickToLogin} className='signinform__link'>J'ai déjà un compte</button>
            </div>
        </div>
    );
}

export default SignInForm;
