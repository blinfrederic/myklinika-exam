import './Login.css'
import { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { useMessages } from '../MessageContext';

export const Login = ({ setDisplayForm, setPage }) => {
    const { login } = useAuth();
    const { errorMessage, setError, successMessage } = useMessages();
    // on fait un objet dans le State afin d'éviter d'avoir plusieurs useState
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };


    // fonction de l'objet qui rend dynamique la saisie et qui définie quel champs on utilise (.name)
    const onChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        })
    }

    // lien qui gère le MDP oublié et inscription
    const handleClickToForget = () => {
        setDisplayForm("forgetPassword")
    }
    const handleClickToSignIn = () => {
        setDisplayForm("signIn")
    }

    //Action à la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Envoi des données en POSt à l'API (temporaire)
        try {
            const response = await fetch(`${process.env.REACT_APP_API_USER_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            })

            if (response.ok) {
                const data = await response.json();
                const { user, token } = data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', JSON.stringify(user.id_user));
                setPage("MapPage")
                login(user)
            } else {
                // Gestion de l'erreur si la requête échoue
                const errorMessage = await response.text(); // Récupérez le message d'erreur du serveur
                throw new Error(errorMessage); // Utilisez le message d'erreur renvoyé par le serveur
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error.message); // Affichez l'erreur dans la console
            // Vous pouvez également mettre à jour l'état pour afficher l'erreur à l'utilisateur
            setError(error.message);
        }
    };

    return (
        <div className='login__block'>
            <div className='login'>
                <h1 className="login__title">Connexion</h1>
                {successMessage && <div className='success__message'>{successMessage}</div>}
                {errorMessage && <div className='error__message'>{errorMessage}</div>}
                <form className='login__form' onSubmit={handleSubmit}>
                    <div className='login__email'>
                        <label htmlFor='email'>Email</label>
                        <input className="login__input" type="text" name="email" title="Votre identifiant" value={credentials.email} id='email' onChange={onChange} />
                    </div>
                    <div className='login__password'>
                        <label htmlFor='password'>Mot de passe</label>
                        <input
                            className="login__input"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            title="Votre mot de passe"
                            value={credentials.password}
                            id='password'
                            onChange={onChange}
                        />
                        <i
                            className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}
                            onClick={handleTogglePassword}
                        ></i>
                    </div>
                    <button className='login__submit'>
                        Se connecter
                    </button>
                </form>
                <div className='login__links'>
                    <button className='login__link' onClick={handleClickToForget}>Mot de passe oublié ?</button>
                    <button className='login__link' onClick={handleClickToSignIn}>Créer un compte</button>
                </div>
            </div>
        </div>
    )
}


