
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Marque.css'

function Marque() {
    const [brands, setBrands] = useState([]);
    // Message d'erreur
    const [error, setError] = useState("");
    /* ========================================== */
    // Récupération des  marques
    const getBrands = async () => {

        try {
            const response = await axios.get(
                "http://localhost:5001/brand"
            );

            setBrands(response.data.data || []);
            setError("");

        } catch (error) {

            console.log(
                "Erreur lors de la récupération des marques :",
                error
            );

            setError(
                error.response?.data?.message ||
                "Une erreur est survenue."
            );

        }
    };

     /* ========================================== */
    useEffect(() => {
        getBrands();
    }, []);

  return (
    <>
    <section className="marques-page">
        <div className="marques-page__header">
            <h3>Nos Marques</h3>
            <button className="marques-page__add-btn">Ajouter une marque</button>
        </div>
        <div className="marques-page__grid">
        {brands.map((brand) => (
            <div className="marque-card" key={brand._id || brand.name}>
                <h2 className="marque-card__name">{brand.name}</h2>
                <a className="marque-card__logo" href={brand.website}><img src={brand.logo} alt={brand.name} /></a>
                <input className="marque-card__toggle" type="checkbox" name="" id="" value={brand.isActive} />
            </div>

        ))}
        </div>
    </section>
    </>
  )
}

export default Marque