import React, { useState, useEffect } from 'react';
import './Loading.css'; // Assurez-vous d'importer votre fichier CSS
import bleu from './myklinica/logo-myklinica-bleu.png'
import rouge from './myklinica/logo-myklinica-rouge.png'
import champagne from './myklinica/logo-myklinica-champ.png'
import bleuC from './myklinica/logo-myklinica-bleuC.png'

const logos = [bleu, rouge, champagne, bleuC];

function Loading() {
  const [currentLogo, setCurrentLogo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogo(prevLogo => (prevLogo + 1) % logos.length);
    }, 900); // Changez ce chiffre pour ajuster la durée entre chaque logo (en millisecondes)

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading__content">

      <div className='loading__para'>
        <p>Bienvenue sur l'application MyKlinica</p>
        <p>MyKlinica est une application d'analyse de donnée publique pour faciliter l'installation des professionnels de santé</p>
        <p>N'hésitez pas à vous inscrire pour profiter de toutes les fonctionnalités de l'application</p>
        <p>Vous pouvez également nous contacter pour nous faire part de vos remarques ou de vos intérrogations</p>
        <a href="https://myklinica.com/contactez-nous-myklinica/">Contactez-nous</a>

      </div>
      <div className="loading__img">
        <div>
          {logos.map((logo, index) => (

          <img
            key={index}
            src={logo}
            alt={`logo myklinica ${index}`}
            className={index === currentLogo ? 'visible' : 'hidden'}
          />
          ))}
        </div>

        <span className='loading__span'>Votre avenir se trouve peut être après ce chargement ...</span>
      </div>
    </div>
  );
}

export default Loading;
