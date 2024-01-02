import React, { useState, useEffect } from 'react';
import ChangePassword from './ChangePassword/ChangePassword';
import { DeleteUser } from './DeleteUser/DeleteUser';
import { useMessages } from '../Layout/MessageContext';
import { useAuth } from '../Layout/AuthProvider';

const ProfilUser = ({ setPage }) => {
  const { isAuthenticated } = useAuth();
  const { errorMessage, setError, successMessage, setSuccess } = useMessages();

  const [isEditing, setIsEditing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [dataUser, setDataUser] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAccessible, setShowshowAccessible] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      // Si l'utilisateur n'est pas authentifié, redirigez-le vers la page de connexion
      setPage('connexion');
    }
  }, [isAuthenticated, setPage]);

  useEffect(() => {
    const findUserById = async () => {
      const id = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${process.env.REACT_APP_API_USER_URL}/users/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDataUser(data);
          setInputText(data);
        } else {
          const errorMessage = await response.text(); // Récupérez le message d'erreur du serveur
          throw new Error(errorMessage);
        }
      } catch (error) {
        setError(error.message)
      }
    };
    findUserById();
  }, [isEditing, setError]);

  const handleEditClick = () => {
    setIsEditing(true);
    setShowshowAccessible(true);
  };

  const updateUser = async () => {
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_USER_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(inputText),
      });

      if (response.ok) {
        setSuccess('Données mises à jour avec succès.');
        setIsEditing(false);
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

  const handleSaveClick = (e) => {
    e.preventDefault();
    updateUser();
    setShowshowAccessible(false);
  };

  const getInputType = (key) => {
    switch (key) {
      case 'telephone':
        return 'tel';
      default:
        return 'text';
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (key, value) => {
    setInputText((prevState) => ({
      ...prevState,
      [key]: value,
    }));

  };

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <div className='card-body'>
            <h2 className='card-title text-center mb-4'>Profil</h2>
            {showAccessible && <p>Tous les champs marqués d'une * sont obligatoire</p>}
            {successMessage && <div className='alert alert-success'>{successMessage}</div>}
            {errorMessage && errorMessage.errors && errorMessage.errors.map((error, index) => {
              return (
                <p key={index} className='signinform__error'>{error ? error : errorMessage}</p>
              )
            })}
            {isEditing && (
              <form onSubmit={handleSaveClick}>
                {Object.keys(dataUser).map((key) => (
                  <div className='form-group' key={key}>
                    {key === 'nom' || key ===  'prenom' || key === 'telephone' || key === 'profession'  ?  <label htmlFor={key}>{key} * :</label> : <label htmlFor={key}>{key} :</label>}
                    <input
                      className='form-control'
                      id={key}
                      placeholder={`Entrer votre ${key}`}
                      type={getInputType(key)}
                      value={inputText[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                    {key === 'Mot de passe' && (
                      <div className='password-toggle' onClick={handleTogglePassword}>
                        {showPassword ? 'Cacher' : 'Afficher'}
                      </div>
                    )}
                  </div>
                ))}
                <button type='submit' className="btn btn-success">Enregistrer</button>
              </form>
            )}
            {!isEditing && (
              <div>
                {Object.keys(dataUser).map((key) => (
                  <p className='form-text' key={key}> 
                     {`${key} : `}
                    <span className={`${key === 'Mot de passe' && !showPassword ? 'password-hidden' : ''}`}>
                      {key === 'Mot de passe' && !showPassword ? '********' : dataUser[key]}
                    </span>
                  </p> 
                ))}
                <button className="btn btn-primary mb-1" onClick={handleEditClick}>Modifier</button>
              </div>
            )}
            <div className='text-center mt-3'>
              <ChangePassword />
            </div>
            <div className='text-center mt-3'>
              <DeleteUser setPage={setPage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilUser;