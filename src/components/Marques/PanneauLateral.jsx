import React, { useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import "./PanneauLateral.css"
function PanneauLateral({ open, onClose }) {
    // Données du formulaire
    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        website: "",
        isActive: true,
    });

    // Message d'erreur
    const [error, setError] = useState("");

    // Message de succes
    const [success, setSuccess] = useState("");

    // Gère tous les champs du formulaire
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Ajouter une marque
    const addBrand = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5001/brand",
                formData
            );

            setSuccess(response.data.message);
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Une erreur est survenue lors de l'ajout de la marque."
            );
            setSuccess("");
        }
    };

    return (
        <>
            {open && (
                <div className="brand-drawer">
                    <div className="brand-drawer__header">
                        <h2>Ajouter une marque</h2>

                        <IoClose
                            className="brand-drawer__close"
                            onClick={onClose}
                        />
                    </div>

                    <form
                        className="brand-drawer__form"
                        onSubmit={addBrand}
                    >
                        <div className="brand-drawer__field">
                            <input
                                id="nom"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nom de la marque"
                                required
                            />
                        </div>

                        <div className="brand-drawer__field">
                            <input
                                id="logo"
                                type="text"
                                name="logo"
                                value={formData.logo}
                                onChange={handleChange}
                                placeholder="Logo"
                                required
                            />
                        </div>

                        <div className="brand-drawer__field">
                            <input
                                id="site-web"
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://www.xxxxxx.com"
                                required
                            />
                        </div>

                        <div className="brand-drawer__checkbox">
                            <label htmlFor="active">
                                Marque active
                            </label>

                            <input
                                id="active"
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            className="brand-drawer__submit"
                            type="submit"
                        >
                            Ajouter
                        </button>
                    </form>

                    {success && (
                        <p className="brand-drawer__success">
                            {success}
                        </p>
                    )}

                    {error && (
                        <p className="brand-drawer__error">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </>
    );
}

export default PanneauLateral;