
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Marque.css'
import PanneauLateral from '../../components/Marques/PanneauLateral';

function Marque() {
    const [brands, setBrands] = useState([]);
    const [open, setOpen] = useState(false)
    const openBrandDrawer = () => {
        setOpen(true)
    }
    const closeBrandDrawer = () => {
        setOpen(false)
    }

    /* ========================================== */
    // Récupération des  marques
    const getBrands = async () => {

        try {
            const response = await axios.get(
                "http://localhost:5001/brand"
            );

            setBrands(response.data.data || []);
           

        } catch (error) {

            console.log(
                "Erreur lors de la récupération des marques :",
                error
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
                    <button className="marques-page__add-btn" onClick={openBrandDrawer}>Ajouter une marque</button>
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
                <PanneauLateral open={open}   onClose={closeBrandDrawer}/>
               
            </section>
        </>
    )
}

export default Marque