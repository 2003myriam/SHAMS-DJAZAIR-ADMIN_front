import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { ChevronDown, ChevronRight, CornerDownRight, ImageOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import DeleteConfirmation from './components/DeleteConfirmation'
import { CategorySheet } from './components/CategorySheet'
import './Category.css'



// Libellé du badge selon la profondeur dans l'arbre
const TYPE_LABELS = ['Parent', 'Sous-catégorie', 'Sous-sous-catégorie']

function Category() {
    // ==========================================
    // Catégories
    // ==========================================
    // catégories parents (1er niveau)
    const [categories, setCategories] = useState([])
    // sous-catégories déjà chargées : { idParent: [sous-catégories] }
    const [subcategories, setSubcategories] = useState({})
    // ids des catégories dépliées
    const [expanded, setExpanded] = useState({})

    // ==========================================
    // Panneau latéral (ajout / modification) + suppression
    // ==========================================
    const [sheetOpen, setSheetOpen] = useState(false)
    // catégorie en cours de modification (null = création)
    const [currentCategory, setCurrentCategory] = useState(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    // catégorie à supprimer (id + nom)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    // ==========================================
    // Récupération des catégories parents
    // ==========================================
    const getCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/categories/parents`)
            setCategories(response.data.data || [])
        } catch (error) {
            toast.error('Impossible de récupérer les catégories.')
        }
    }

    // ==========================================
    // Récupération des sous-catégories d'une catégorie
    // ==========================================
    const getSubcategories = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5001/categories/${id}/subcategories`)
            setSubcategories((prev) => ({ ...prev, [id]: response.data.data || [] }))
        } catch (error) {
            // l'API renvoie une erreur quand la catégorie n'a pas de sous-catégorie
            setSubcategories((prev) => ({ ...prev, [id]: [] }))
        }
    }

    // ==========================================
    // Chargement initial
    // ==========================================
    useEffect(() => {
        getCategories()
    }, [])

    // ==========================================
    // Recharger après un ajout / modification / suppression
    // (parents + sous-catégories des lignes dépliées)
    // ==========================================
    const refresh = () => {
        getCategories()
        Object.keys(expanded)
            .filter((id) => expanded[id])
            .forEach(getSubcategories)
    }

    // ==========================================
    // Déplier / replier une catégorie
    // ==========================================
    const toggleExpand = (id) => {
        // on charge les sous-catégories seulement la 1ère fois
        if (!expanded[id] && !subcategories[id]) getSubcategories(id)
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    // ==========================================
    // Ajouter / modifier une catégorie
    // ==========================================
    const openSheet = (category = null) => {
        setCurrentCategory(category)
        setSheetOpen(true)
    }

    // ==========================================
    // Supprimer une catégorie
    // ==========================================
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`http://localhost:5001/categories/${categoryToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            refresh()
            setDeleteDialogOpen(false)
        } catch (error) {
            // on affiche la raison renvoyée par le backend (ex : catégorie parent avec des sous-catégories)
            toast.error(error.response?.data?.message || "Impossible de supprimer la catégorie.")
        }
    }

    // ==========================================
    // Affichage d'une ligne puis de ses sous-catégories (si dépliée)
    // ==========================================
    const renderRow = (c, level = 0) => {
        const children = subcategories[c._id]
        const isOpen = expanded[c._id]
        // tant que les sous-catégories ne sont pas chargées, on affiche le chevron
        const hasChildren = children === undefined || children.length > 0

        return (
            <Fragment key={c._id}>
                <TableRow>
                    {/* Nom */}
                    <TableCell>
                        <div className="category__name" style={{ paddingLeft: `${level * 1.5}rem` }}>
                            {hasChildren ? (
                                <button
                                    type="button"
                                    className="category__toggle"
                                    onClick={() => toggleExpand(c._id)}
                                    aria-label={isOpen ? 'Replier' : 'Déplier'}
                                >
                                    {isOpen ? <ChevronDown /> : <ChevronRight />}
                                </button>
                            ) : (
                                <span className="category__toggle category__toggle--empty">
                                    {level > 0 && <CornerDownRight />}
                                </span>
                            )}
                            {c.image ? (
                                <img src={c.image} alt={c.name} className="category__image" />
                            ) : (
                                <span className="category__image category__image--empty"><ImageOff /></span>
                            )}
                            <span className={level === 0 ? 'category__label category__label--parent' : 'category__label'}>
                                {c.name}
                            </span>
                            <Badge variant="secondary" className="category__type">
                                {TYPE_LABELS[Math.min(level, TYPE_LABELS.length - 1)]}
                            </Badge>
                        </div>
                    </TableCell>
                    {/* Produits */}
                    <TableCell>{c.countProduct ?? '—'}</TableCell>
                    {/* Statut */}
                    <TableCell>
                        <Badge className={c.isActive ? 'category__status--active' : 'category__status--inactive'}>
                            {c.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </TableCell>
                    {/* Actions */}
                    <TableCell className="produits__actions">
                        <Button variant="ghost" size="icon" onClick={() => openSheet(c)} aria-label="Modifier">
                            <Pencil />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setCategoryToDelete(c) // je garde la catégorie (id + nom)
                                setDeleteDialogOpen(true)
                            }}
                            aria-label="Supprimer"
                        >
                            <Trash2 />
                        </Button>
                    </TableCell>
                </TableRow>

                {/* Sous-catégories */}
                {isOpen && children?.map((child) => renderRow(child, level + 1))}
            </Fragment>
        )
    }

    return (
        <>
            <Header />
            <Main>
                {/* Titre + bouton */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Catégories</h1>
                        <p className="produits__subtitle">Voici la liste de vos catégories et sous-catégories.</p>
                    </div>
                    <Button onClick={() => openSheet()}><Plus />Ajouter une catégorie</Button>
                </div>

                {/* Tableau */}
                <div className="produits__table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom</TableHead>
                                <TableHead>Produits</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="produits__actions">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="produits__empty">Aucune catégorie.</TableCell>
                                </TableRow>
                            )}
                            {categories.map((c) => renderRow(c))}
                        </TableBody>
                    </Table>
                </div>

                {/* Panneau latéral (ajout / modification) */}
                <CategorySheet
                    open={sheetOpen}
                    onOpenChange={setSheetOpen}
                    category={currentCategory}
                    onSave={refresh}
                />

                {/* Panneau de suppression */}
                <DeleteConfirmation
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDelete}
                    categoryName={categoryToDelete?.name}
                />
            </Main>
        </>
    )
}

export default Category
