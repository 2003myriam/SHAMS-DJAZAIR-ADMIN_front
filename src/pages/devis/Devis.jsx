import { useEffect, useState } from 'react'
import axios from 'axios'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import { FaEye } from "react-icons/fa";
import DevisDetail from './components/DevisDetail'
import './Devis.css'
import DeleteConfirmation from './components/DeleteConfirmation'
import Pagination from '@mui/material/Pagination'
import { DevisSheet } from './components/DevisSheet'
function Devis() {
    // ==========================================
    // Devis
    // ==========================================
    const [devis, setDevis] = useState([])
    // ==========================================
    // Panneau latéral (ajout / modification)
    // ==========================================
    // panneau ouvert ou fermé
    const [sheetOpen, setSheetOpen] = useState(false)
    // delete ouvert ou fermé
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    // quel devis selectionnée + le dialog de voir le detail
    const [selectedDevis, setSelectedDevis] = useState(null)
    const [dialogdetailOpen, setDialogdetailOpen] = useState(false)
    const [devisToDelete, setDevisToDelete] = useState(null)
    // devis en cours de modification (null = création)
    const [currentDevis, setCurrentDevis] = useState(null)

    // ==========================================
    // Pagination
    // ==========================================

    const [pagination, setPagination] = useState({
        currentPage: 1,
        devisPerPage: 12,
        totalDevis: 0,
        totalPages: 0,
    })
    // ==========================================
    // Récupération des devis
    // ==========================================

    const getDevis = async (page = 1) => {
        try {
            const response = await axios.get(
                `http://localhost:5001/request?page=${page}&limit=${pagination.devisPerPage}`
            )

            setDevis(response.data.data || [])

            setPagination(
                response.data.pagination || {
                    currentPage: page,
                    devisPerPage: pagination.devisPerPage,
                    totalDevis: 0,
                    totalPages: 0,
                }
            )
        } catch (error) {

            toast.error("Impossible de récupérer les devis.")
        }
    }

    // ==========================================
    // Changement de page
    // ==========================================

    const PaginateDevisPage = (event, page) => {
        getDevis(page)
    }

    // ==========================================
    // Chargement initial
    // ==========================================

    useEffect(() => {

        getDevis(1)

    }, [])
    // ==========================================
    // Ouvrir le panneau de detail d'un produit 
    // ==========================================

    const openDetail = (devis) => {
        setSelectedDevis(devis)
        setDialogdetailOpen(true)
    }
    // ==========================================
    // Ajouter une demande
    // ==========================================
    const openCreate = () => {
        setCurrentDevis(null)
        setSheetOpen(true)
    }

    // ==========================================
    // Modifier une demande
    // ==========================================
    const openEdit = (devis) => {
        setCurrentDevis(devis)
        setSheetOpen(true)
    }
    // ==========================================
    // supprimer une  demande
    // ==========================================
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:5001/request/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            getDevis(pagination.currentPage)
            setDeleteDialogOpen(false)
        } catch (error) {


            toast.error("Impossible de supprimer la demande.")
        }
    }

    return (
        <>
            <Header />
            <Main>
                {/* Titre + bouton */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Demande de devis</h1>
                        <p className="produits__subtitle">Voici la liste des demande de devis.</p>
                    </div>
                    <Button onClick={openCreate}><Plus />Ajouter une demande</Button>
                </div>

                {/* Tableau */}
                <div className="produits__table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom et prénom </TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Numéro de téléphone</TableHead>
                                <TableHead className="devis__center">Date de la demande</TableHead>
                                <TableHead>Entreprise</TableHead>
                                <TableHead className="devis__center">Detail de la demande</TableHead>
                                <TableHead className="produits__actions">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucun produit */}
                            {devis.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="produits__empty">Aucune demande .</TableCell>
                                </TableRow>
                            )}
                            {/* Devis affichage  */}
                            {devis.map((d) => (
                                <TableRow key={d._id}>
                                    {/* Nom et prenom  */}
                                    <TableCell>{d.firstName} | {d.lastName} </TableCell>
                                    {/* email */}
                                    <TableCell>{d.email}</TableCell>
                                    {/* phone */}
                                    <TableCell>{d.phone}</TableCell>
                                    {/* date */}
                                    <TableCell className="devis__center">
                                        {new Date(d.created_at).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    {/* entreprise */}
                                    <TableCell>{d.company || "Aucune"}</TableCell>
                                    {/* Detail de la demande */}
                                    <TableCell className="devis__center devis__eye" onClick={() => openDetail(d)}><FaEye /></TableCell>

                                    {/* Actions */}
                                    <TableCell className="produits__actions">
                                        {/* ICONE MODIFIER  */}
                                        <Button variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(d)}
                                            aria-label="Modifier">
                                            <Pencil /></Button>
                                        {/* ICONE SUPPRIMER  */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setDevisToDelete(d._id) // je garde ID de devis
                                                setDeleteDialogOpen(true) // la boite est en etat ouvert
                                            }}
                                            aria-label="Supprimer"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </div>
                <DevisDetail
                    open={dialogdetailOpen}
                    onOpenChange={setDialogdetailOpen}
                    devis={selectedDevis}
                />
                {/* Panneau latéral (ajout / modification) */}
                <DevisSheet
                    open={sheetOpen}
                    onOpenChange={setSheetOpen}
                    devis={currentDevis}
                    onSave={() => getDevis(currentDevis ? pagination.currentPage : 1)}
                />
                <DeleteConfirmation
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={() => handleDelete(devisToDelete)}
                />
                {pagination.totalPages > 1 && (

                    <div className="produitback-pagination">

                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={PaginateDevisPage}
                            color="primary"
                        />

                    </div>

                )}
            </Main >
        </>
    )
}

export default Devis