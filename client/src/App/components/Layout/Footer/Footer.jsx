import React from "react";
import "./Footer.css";
import logoFacebook from "../../../../images/logo/facebook-logo.png";
import logoInstagram from "../../../../images/logo/instagram-logo.png";
import logoLinkedin from "../../../../images/logo/linkedin-logo.png";
import logoYoutube from "../../../../images/logo/youtube-logo.png";
// import Publicite from '../../HomePage/Publicite/Publicite.jsx';

export default function Footer() {
  return (
    <>
      <footer>
        <div className="footer-block">
          <p className="footer__paragraph">Suivez-nous :</p>
          <ul className="footer__list">
            <li className="footer__list__list card">
              <img
                src={logoFacebook}
                alt="logo facebook"
                className="footer__logo"
              />
              <a
                className="footer__link"
                href="https://www.facebook.com/MyKLINICA"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li className="footer__list__list card">
              <img
                src={logoInstagram}
                alt="logo instagram"
                className="footer__logo"
              />
              <a
                className="footer__link"
                href="https://www.instagram.com/myklinica/?hl=fr"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li className="footer__list__list card">
              <img
                src={logoLinkedin}
                alt="logo linkedin"
                className="footer__logo"
              />
              <a
                className="footer__link"
                href="https://www.linkedin.com/in/maud-clerice/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li className="footer__list__list card">
              <img
                src={logoYoutube}
                alt="logo youtube"
                className="footer__logo"
              />
              <a
                className="footer__link"
                href="https://www.youtube.com/channel/UCBuz2LmzvDV8pEvTiv4Vkdw"
                target="_blank"
                rel="noopener noreferrer"
              >
                Youtube
              </a>
            </li>
          </ul>
        </div>
        <div className="show__pub">{/* <Publicite /> */}</div>
      </footer>
    </>
  );
}
