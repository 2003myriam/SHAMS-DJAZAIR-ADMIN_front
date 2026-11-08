// Page de toutes les entreprises : affichées sous forme de blocs, l'un sous l'autre.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Clock, Globe, Mail, MapPin, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import Pagination from '@mui/material/Pagination'
import '../products/Produits.css'
import '../clients/Clients.css'
import './Entreprises.css'

function Entreprises() {
    // ==========================================
    // Entreprises
    // ==========================================
    const [companies, setCompanies] = useState([])

    // ==========================================
    // Pagination
    // ==========================================
    const [pagination, setPagination] = useState({
        currentPage: 1,
        companiesPerPage: 12,
        totalCompanies: 0,
        totalPages: 0,
    })

    // ==========================================
    // Récupération des entreprises
    // ==========================================
    const getCompanies = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/companies?page=${page}&limit=${pagination.companiesPerPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            setCompanies(response.data.data || [])
            if (response.data.pagination) setPagination(response.data.pagination)
        } catch (error) {
            toast.error("Impossible de récupérer les entreprises.")
        }
    }

    // ==========================================
    // Chargement initial
    // ==========================================
    useEffect(() => {
        getCompanies(1)
    }, [])

    return (
        <>
            <Header />
            <Main>
                {/* Titre */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Entreprises</h1>
                        <p className="produits__subtitle">Voici la liste de toutes les entreprises.</p>
                    </div>
                </div>

                {/* Aucune entreprise */}
                {companies.length === 0 && (
                    <p className="produits__empty">Aucune entreprise.</p>
                )}

                {/* Blocs des entreprises, l'un sous l'autre */}
                <div className="entreprises__list">
                    {companies.map((c) => (
                        <div key={c._id} className="entreprise">

                            {/* En-tête : logo / initiale + nom + statut */}
                            <div className="entreprise__header">
                                <div className="client__name">
                                    {c.logo ? (
                                        <img src={c.logo} alt={c.name} className="entreprise__logo" />
                                    ) : (
                                        <span className="client__avatar">{(c.name?.[0] || '').toUpperCase()}</span>
                                    )}
                                    <span className="entreprise__name">{c.name}</span>
                                </div>
                                <Badge className={c.isActive ? 'client__status--active' : 'client__status--inactive'}>
                                    {c.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>

                            {/* Description */}
                            {c.description && (
                                <p className="entreprise__description">{c.description}</p>
                            )}

                            {/* Coordonnées */}
                            <div className="entreprise__infos">
                                <span><Mail /> {c.email || '-'}</span>
                                <span><Phone /> {c.phone || '-'}</span>
                                <span><MapPin /> {c.address || '-'}</span>
                                <span>
                                    <Globe />
                                    {c.website
                                        ? <a href={c.website} target="_blank" rel="noreferrer" className="underline">{c.website}</a>
                                        : '-'}
                                </span>
                                {c.workingHours && <span><Clock /> {c.workingHours}</span>}
                            </div>

                            {/* Secteurs d'activité */}
                            {c.activitySectorIds?.length > 0 && (
                                <div className="entreprise__sectors">
                                    {c.activitySectorIds.map((sector) => (
                                        <Badge key={sector._id} variant="secondary">{sector.name}</Badge>
                                    ))}
                                </div>
                            )}

                            {/* Informations fiscales */}
                            <div className="entreprise__fiscal">
                                <span><strong>NIF :</strong> {c.NIF || '-'}</span>
                                <span><strong>NIS :</strong> {c.NIS || '-'}</span>
                                <span><strong>RC :</strong> {c.RC || '-'}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="produitback-pagination">
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={(event, page) => getCompanies(page)}
                            color="primary"
                        />
                    </div>
                )}
            </Main>
        </>
    )
}

export default Entreprises
