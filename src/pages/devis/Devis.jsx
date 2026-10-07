
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import { FaEye } from "react-icons/fa";
function Devis() {
    // ==========================================
    // Devis
    // ==========================================
    const [devis, setDeviss] = useState([])
    // ==========================================
    // Panneau latéral (ajout / modification)
    // ==========================================
    // panneau ouvert ou fermé
    const [sheetOpen, setSheetOpen] = useState(false)

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
                `http://localhost:5001/request?page=${page}&limit=${pagination.productsPerPage}`
            )

            setDeviss(response.data.data || [])

            setPagination(
                response.data.pagination || {
                    currentPage: page,
                    devisPerPage: pagination.devisPerPage,
                    totalDeviss: 0,
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
                    {/*onClick={openCreate} */}
                    <Button ><Plus />Ajouter une demande</Button>
                </div>

                {/* Tableau */}
                <div className="produits__table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom et prénom </TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Numéro de téléphone</TableHead>
                                <TableHead>Entreprise</TableHead>
                                <TableHead>Detail de la demande</TableHead>
                                <TableHead className="produits__actions">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucun produit */}
                            {devis.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="produits__empty">Aucune demande .</TableCell>
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
                                    {/* entreprise */}
                                    <TableCell>{d.company || "Aucune"}</TableCell>
                                    {/* Detail de la demande */}
                                    <TableCell> <FaEye /></TableCell>

                                    {/* Actions */}
                                    <TableCell className="produits__actions">
                                        {/* ICONE MODIFIER  */}
                                        <Button variant="ghost"
                                            size="icon"
                                            // onClick={() => openEdit(b)}
                                            aria-label="Modifier">
                                            <Pencil /></Button>
                                        {/* ICONE SUPPRIMER  */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            // onClick={() => {
                                            //     setBrandToDelete(b._id) // je garde ID de la marque
                                            //     setBrandNameToDelete(b.name) // je garde nom de la marque 
                                            //     setDeleteDialogOpen(true) // la boite est en etat ouvert
                                            // }}
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
            </Main >
        </>
    )
}

export default Devis