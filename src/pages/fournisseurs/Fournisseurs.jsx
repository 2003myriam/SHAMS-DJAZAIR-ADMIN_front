import { useEffect, useState } from 'react'
import axios from 'axios'
import { Download, Pencil, Plus, SearchIcon, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { saveAs } from 'file-saver'
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
import { usePermission } from '@/hooks/usePermission'

// valeur du Select pour « toutes les catégories » (un SelectItem ne peut pas avoir value="")
const ALL_CATEGORIES = 'all'

function Fournisseurs() {

    // ==========================================
    // Permissions (selon le rôle de l'utilisateur connecté)
    // ==========================================
    const canCreate = usePermission("suppliers", "create")
    const canUpdate = usePermission("suppliers", "update")
    const canDelete = usePermission("suppliers", "delete")
    const canExport = usePermission("suppliers", "read")
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
    // Recherche par nom
    // ==========================================
    const [search, setSearch] = useState('')

    // paramètres communs à la liste et à l'export (catégorie + recherche)
    const filterParams = () => ({
        ...(category !== ALL_CATEGORIES && { categoryId: category }),
        ...(search.trim() && { search: search.trim() }),
    })

    // ==========================================
    // Suppression : dialog ouvert ou fermé + fournisseur à supprimer
    // ==========================================
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [supplierToDelete, setSupplierToDelete] = useState(null)

    // ==========================================
    // Ajout / modification : panneau latéral ouvert ou fermé
    // + fournisseur en cours de modification (null = création)
    // ==========================================
    const [sheetOpen, setSheetOpen] = useState(false)
    const [currentSupplier, setCurrentSupplier] = useState(null)

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
                `${import.meta.env.VITE_API_URL}/suppliers`,
                {
                    params: { page, limit: pagination.suppliersPerPage, ...filterParams() },
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
    // Exporter les fournisseurs (Excel) — selon la catégorie choisie
    // ==========================================
    const handleExport = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/suppliers/export`,
                {
                    params: filterParams(), // la catégorie et la recherche en cours sont prises en compte lors de l'exportation
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    responseType: "blob",
                }
            )
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
            saveAs(blob, "Fournisseurs_DATA.xlsx")
            toast.success("Exportation réussie !")
        } catch (error) {
            // avec responseType "blob", le message d'erreur du serveur arrive sous forme de Blob
            let message = "Impossible d'exporter les fournisseurs."
            if (error.response?.data instanceof Blob) {
                try {
                    const json = JSON.parse(await error.response.data.text())
                    if (json.message) message = json.message
                } catch { /* réponse non JSON */ }
            }
            toast.error(message)
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
    // Chargement des fournisseurs (au départ + à chaque changement de catégorie ou de recherche)
    // ==========================================
    useEffect(() => {
        getSuppliers(1)
    }, [category, search])

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
                        {canExport && (
                          <Button variant="outline" onClick={handleExport}>
                              <Download />
                              Exporter
                          </Button>
                        )}

                        {canCreate && (
                          <Button
                              onClick={() => {
                                  setCurrentSupplier(null)
                                  setSheetOpen(true)
                              }}
                          >
                              <Plus />
                              Ajouter un fournisseur
                          </Button>
                        )}
                    </div>
                </div>

                {/* Barre d'outils : recherche à gauche, filtre à droite */}
                <div className="devis__toolbar">
                    {/* Recherche par nom */}
                    <div className="produits__search">
                        <SearchIcon className="produits__search-icon" />
                        <Input
                            type="text"
                            placeholder="Nom du fournisseur..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="produits__search-input"
                        />
                        {/* Effacer la recherche */}
                        {search && (
                            <button
                                type="button"
                                className="produits__search-clear"
                                onClick={() => setSearch('')}
                                aria-label="Effacer la recherche"
                            >
                                <X />
                            </button>
                        )}
                    </div>

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
                                        {canUpdate && (
                                          <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => {
                                                  setCurrentSupplier(s)
                                                  setSheetOpen(true)
                                              }}
                                              aria-label="Modifier"
                                          >
                                              <Pencil />
                                          </Button>
                                        )}
                                        {canDelete && (
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
                                        )}
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
                supplier={currentSupplier}
                categories={categories}
                onSave={() => getSuppliers(currentSupplier ? pagination.currentPage : 1)}
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
