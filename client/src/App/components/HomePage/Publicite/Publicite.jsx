import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "./styles.css"; // Assurez-vous d'importer votre fichier CSS

export default function App() {
    const [propertyListings, setPropertyListings] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://myklinica.com/');
                const data = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "text/html");

                const listings = Array.from(doc.querySelectorAll('.property_listing'));
                setPropertyListings(listings);
            } catch (error) {
                console.error(error);
            }
        };

        if (propertyListings.length === 0) {
            fetchData();
            const interval = setInterval(() => {
                setCurrentIndex(prevIndex => (prevIndex + 1) % propertyListings.length);
            }, 4000); // Défilement toutes les 3 secondes

            return () => {
                clearInterval(interval);
            };
        }
    }, [propertyListings.length]);

    return (
        <div className="footer__pub">
            <h4>N'attendez plus, rejoignez-nous !</h4>
            {propertyListings.length > 0 && (
                <div className="property-listing-container">
                    {propertyListings.length > 0 && (
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(propertyListings[currentIndex].outerHTML) }} />
                    )}
                </div>
            )}

        </div>
    );
}
