import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../../../../images/logo/logo-myklinica.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPen, faUserSlash, faUserGear, faHouseLaptop, faBars } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthProvider.jsx';


export default function Header(props) {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991); // Vérifiez si l'écran est mobile (<= 991px)
    const { isAuthenticated, logout } = useAuth(); // Utilisez le contexte d'authentification

    const iconItems = isAuthenticated
        ? [
            { icon: faUserSlash, page: 'logout', label: 'Déconnexion' },
            { icon: faUserGear, page: 'ProfilUser', label: 'Mon compte' }
        ]
        : [
            { icon: faUser, page: 'login', label: 'Connexion' },
            { icon: faUserPen, page: 'signIn', label: 'Inscription' }
        ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 991);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);




    return (
        <nav className="navbar-style navbar navbar-expand-lg p-4 ">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                {isMobile ? null : (
                    <ul className="navbar-nav">
                        <li className={`nav-item nav-item-style nav-link text-center ${props.page === 'MapPage' ? 'active' : ''}`} onClick={() => props.setPage('MapPage')} tabIndex="0">
                            <div><FontAwesomeIcon icon={faHouseLaptop} /></div>
                            <span>Accueil</span>
                        </li>
                    </ul>
                )}

                <div className="text-center w-100">
                    <img className="img-fluid header__logo" src={logo} alt="logo" />
                </div>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>

                <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav ms-auto">
                        {isMobile ? (
                            <ul className="navbar-nav">
                                <li className={`nav-item nav-item-style nav-link text-center ${props.page === 'MapPage' ? 'active' : ''}`} onClick={() => props.setPage('MapPage')} tabIndex="0">
                                    <div><FontAwesomeIcon icon={faHouseLaptop} />
                                        <span>Accueil</span></div>
                                </li>
                            </ul>
                        ) : null}
                        {iconItems.map((item, index) => (

                            <li className={`nav-item nav-item-style nav-link text-center ${props.displayForm === item.page && props.page !== 'MapPage' ? 'active' : ''}`} key={index} onClick={() => {
                                if (item.page === 'logout') {
                                    logout();
                                } else if (item.page === 'login') {
                                    props.setPage('connexion');

                                } else if (item.page === 'signIn') {
                                    props.setPage('connexion');

                                } else if (item.page === 'ProfilUser') {
                                    props.setPage('ProfilUser');
                                }
                                props.setDisplayForm(item.page);
                            }} tabIndex="0">
                                <div><FontAwesomeIcon icon={item.icon} />
                                    <span>{item.label}</span></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>

    );
}
