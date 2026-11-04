import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import Pagination from '@mui/material/Pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import '../products/Produits.css'
import '../devis/Devis.css'
import '../clients/Clients.css'
import DeleteSupplier from './components/DeleteSupplier'
import { SupplierSheet } from './components/SupplierSheet'

// valeur du Select pour « toutes les catégories » (un SelectItem ne peut pas avoir value="")
const ALL_CATEGORIES = 'all'

function Fournisseurs() {
    // ==========================================
    // Fournisseurs
    // ==========================================
    const [suppliers, setSuppliers] = useState([])

    // ==========================================
    // Filtrage par catégorie
    // ==========================================
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(ALL_CATEGORIES)

    // ==========================================
    // Suppression : dialog ouvert ou fermé + fournisseur à supprimer
    // ==========================================
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [supplierToDelete, setSupplierToDelete] = useState(null)

    // ==========================================
    // Ajout : panneau latéral ouvert ou fermé
    // ==========================================
    const [sheetOpen, setSheetOpen] = useState(false)

    // ==========================================
    // Pagination
    // ==========================================
    const [pagination, setPagination] = useState({
        currentPage: 1,
        suppliersPerPage: 12,
        totalSuppliers: 0,
        totalPages: 0,
    })

    // ==========================================
    // Récupération des fournisseurs
    // ==========================================
    const getSuppliers = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/suppliers?page=${page}&limit=${pagination.suppliersPerPage}`
                + (category !== ALL_CATEGORIES ? `&categoryId=${category}` : ''),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            setSuppliers(response.data.data || [])
            if (response.data.pagination) setPagination(response.data.pagination)
        } catch (error) {
            toast.error("Impossible de récupérer les fournisseurs.")
        }
    }

    // ==========================================
    // Supprimer un fournisseur
    // ==========================================
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_API_URL}/suppliers/${supplierToDelete._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            toast.success("Fournisseur supprimé.")
            setDeleteDialogOpen(false)
            getSuppliers(pagination.currentPage)
        } catch (error) {
            toast.error("Impossible de supprimer le fournisseur.")
        }
    }

    // ==========================================
    // Récupération des catégories (pour le filtre)
    // ==========================================
    const getCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`)
            setCategories(response.data.data || [])
        } catch (error) {
            toast.error("Impossible de récupérer les catégories.")
        }
    }

    // ==========================================
    // Chargement initial des catégories
    // ==========================================
    useEffect(() => {
        getCategories()
    }, [])

    // ==========================================
    // Chargement des fournisseurs (au départ + à chaque changement de catégorie)
    // ==========================================
    useEffect(() => {
        getSuppliers(1)
    }, [category])

    return (
        <>
            <Header />
            <Main>
                {/* Titre */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Fournisseurs</h1>
                        <p className="produits__subtitle">Voici la liste des fournisseurs.</p>
                    </div>
                    <div className="produits__toolbar">
                        <Button onClick={() => setSheetOpen(true)}>
                            <Plus />
                            Ajouter un fournisseur
                        </Button>
                    </div>
                </div>

                {/* Barre d'outils : filtres */}
                <div className="devis__toolbar">
                    {/* Filtre par catégorie */}
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="devis__status-filter">
                            <SelectValue placeholder="Filtrer par catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={ALL_CATEGORIES}>Toutes les catégories</SelectItem>
                                {categories.map((c) => (
                                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Tableau */}
                <div className="produits__table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Numéro de téléphone</TableHead>
                                <TableHead>Adresse</TableHead>
                                <TableHead>Catégorie</TableHead>
                                <TableHead>Spécialités</TableHead>
                                <TableHead className="devis__center">Date de création</TableHead>
                                <TableHead className="produits__actions">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucun fournisseur */}
                            {suppliers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="produits__empty">Aucun fournisseur.</TableCell>
                                </TableRow>
                            )}
                            {/* Fournisseurs affichage */}
                            {suppliers.map((s) => (
                                <TableRow key={s._id}>
                                    {/* nom */}
                                    <TableCell>
                                        <div className="client__name">
                                            <span className="client__avatar">
                                                {(s.name?.[0] || '').toUpperCase()}
                                            </span>
                                            {s.name}
                                        </div>
                                    </TableCell>
                                    {/* email */}
                                    <TableCell>{s.email || '-'}</TableCell>
                                    {/* phone */}
                                    <TableCell>{s.phone || '-'}</TableCell>
                                    {/* adresse */}
                                    <TableCell>{s.address || '-'}</TableCell>
                                    {/* catégorie */}
                                    <TableCell>{s.categoryId?.name || '-'}</TableCell>
                                    {/* spécialités */}
                                    <TableCell>
                                        {s.specialties?.length > 0
                                            ? s.specialties.map((sp) => (
                                                <Badge key={sp} variant="secondary" className="mr-1">{sp}</Badge>
                                            ))
                                            : '-'}
                                    </TableCell>
                                    {/* date de création */}
                                    <TableCell className="devis__center">
                                        {s.createdAt
                                            ? new Date(s.createdAt).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : '-'}
                                    </TableCell>
                                    {/* actions */}
                                    <TableCell className="produits__actions">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setSupplierToDelete(s)
                                                setDeleteDialogOpen(true)
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="produitback-pagination">
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={(event, page) => getSuppliers(page)}
                            color="primary"
                        />
                    </div>
                )}
            </Main>

            {/* Panneau latéral (ajout) */}
            <SupplierSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                categories={categories}
                onSave={() => getSuppliers(1)}
            />

            {/* Confirmation de suppression */}
            <DeleteSupplier
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
                supplierName={supplierToDelete?.name}
            />
        </>
    )
}

export default Fournisseurs
