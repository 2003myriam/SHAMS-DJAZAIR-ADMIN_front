import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import Pagination from '@mui/material/Pagination'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import '../products/Produits.css'
import '../devis/Devis.css'
import '../clients/Clients.css'

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
                `http://localhost:5001/suppliers?page=${page}&limit=${pagination.suppliersPerPage}`
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
    // Récupération des catégories (pour le filtre)
    // ==========================================
    useEffect(() => {
        axios.get('http://localhost:5001/categories')
            .then((response) => setCategories(response.data.data || []))
            .catch(() => toast.error("Impossible de récupérer les catégories."))
    }, [])

    // ==========================================
    // Chargement initial + à chaque changement de catégorie
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
                    {/* Filtre par catégorie */}
                    <div className="produits__toolbar">
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="produit-sheet__select">
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucun fournisseur */}
                            {suppliers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="produits__empty">Aucun fournisseur.</TableCell>
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
        </>
    )
}

export default Fournisseurs
