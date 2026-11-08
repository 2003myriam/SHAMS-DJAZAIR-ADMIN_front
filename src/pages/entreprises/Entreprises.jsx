// Page de toutes les entreprises : affichées sous forme de blocs, l'un sous l'autre.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Clock, Globe, Mail, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import Pagination from '@mui/material/Pagination'
import '../products/Produits.css'
import '../clients/Clients.css'
import './Entreprises.css'
import { CompanySheet } from './components/CompanySheet'
import DeleteCompany from './components/DeleteCompany'

function Entreprises() {
    // ==========================================
    // Entreprises
    // ==========================================
    const [companies, setCompanies] = useState([])

    // ==========================================
    // Ajout : panneau latéral ouvert ou fermé
    // ==========================================
    const [sheetOpen, setSheetOpen] = useState(false)
    // entreprise en cours de modification (null = création)
    const [currentCompany, setCurrentCompany] = useState(null)

    // ==========================================
    // Suppression : dialog ouvert ou fermé + entreprise à supprimer
    // ==========================================
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [companyToDelete, setCompanyToDelete] = useState(null)

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
    // Supprimer une entreprise
    // ==========================================
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_URL}/companies/${companyToDelete._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            toast.success("Entreprise supprimée.")
            setDeleteDialogOpen(false)
            getCompanies(pagination.currentPage)
        } catch (error) {
            toast.error(error.response?.data?.message || "Impossible de supprimer l'entreprise.")
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
                    <div className="produits__toolbar">
                        <Button onClick={() => {
                            setCurrentCompany(null)
                            setSheetOpen(true)
                        }}>
                            <Plus />
                            Ajouter une entreprise
                        </Button>
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
                                {/* Secteurs d'activité + statut, à droite */}
                                <div className="entreprise__sectors">
                                    {c.activitySectorIds?.map((sector) => (
                                        <Badge key={sector._id} variant="secondary">{sector.name}</Badge>
                                    ))}
                                    <Badge className={c.isActive ? 'client__status--active' : 'client__status--inactive'}>
                                        {c.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
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

                            {/* Informations fiscales à gauche + actions à droite */}
                            <div className="entreprise__footer">
                                <div className="entreprise__fiscal">
                                    <span><strong>NIF :</strong> {c.NIF || '-'}</span>
                                    <span><strong>NIS :</strong> {c.NIS || '-'}</span>
                                    <span><strong>RC :</strong> {c.RC || '-'}</span>
                                </div>
                                <div className="entreprise__actions">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setCurrentCompany(c)
                                            setSheetOpen(true)
                                        }}
                                        aria-label="Modifier"
                                    >
                                        <Pencil />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setCompanyToDelete(c)
                                            setDeleteDialogOpen(true)
                                        }}
                                        aria-label="Supprimer"
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
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

            {/* Panneau latéral (ajout) : recharger la liste après l'ajout */}
            <CompanySheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                company={currentCompany}
                onCompanyCreated={() => getCompanies(currentCompany ? pagination.currentPage : 1)}
            />

            {/* Confirmation de suppression */}
            <DeleteCompany
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                companyName={companyToDelete?.name}
            />
        </>
    )
}

export default Entreprises
