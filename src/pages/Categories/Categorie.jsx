import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./Categorie.css"

function Categorie() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState([]);
    /* ========================================== */
    // Récupération des  categories
    const getCategories = async () => {

        try {
            const response = await axios.get(
                "http://localhost:5001/categories "
            );

            setCategories(response.data.data || []);


        } catch (error) {

            console.log(
                "Erreur lors de la récupération des marques :",
                error
            );
        }
    };
    /* ========================================== */
    useEffect(() => {
        getCategories();
    }, []);

    /* ========================================== */
    /* ======== Toggle categorie========= */
    const toggleCategorie = async (id) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.patch(
                `http://localhost:5001/categories/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCategories((prevCategories) =>
                prevCategories.map((category) =>
                    category._id === id
                        ? { ...category, isActive: !category.isActive }
                        : category
                )
            );

            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message || "Erreur lors de la modification."
            );
        }
    };
    return (
        <>
            <section className="categories-page">
                <div className="categories-page__header">
                    <h3>Nos Categories</h3>
                    <button className="categories-page__add-btn"  >Ajouter une categorie</button>
                </div>
                <div className="categories-page__grid">
                    {categories.map((cat) => (
                        <div className="categories-card">
                            <div className="categories-card__image-wrapper">
                                <img
                                    className="categories-card__image"
                                    src={cat.image}
                                    alt={cat.name}
                                />

                                <span className="categories-card__parent-badge">
                                    {cat.parentCategoryId
                                        ? cat.parentCategoryId.name
                                        : "Catégorie principale"}
                                </span>
                            </div>

                            <div className="categories-card__content">
                                <h2 className="categories-card__name">{cat.name}</h2>

                                <p className="categories-card__description">
                                    {cat.description}
                                </p>

                                <div className="categories-card__footer">
                                    <div
                                        className={`categories-card__status ${!cat.isActive ? "categories-card__status--inactive" : ""
                                            }`}
                                    >
                                        <span className="categories-card__status-dot"></span>
                                        {cat.isActive ? "Active" : "Inactive"}
                                    </div>

                                    <input
                                        className="categories-card__toggle"
                                        type="checkbox"
                                        checked={cat.isActive}
                                        onChange={() => toggleCategorie(cat._id)}
                                    />
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </section>
        </>
    )
}

export default Categorie