import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { ChevronDown, ChevronRight, CornerDownRight, Eye, ImageOff, MoreHorizontal, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import './Category.css'
import { Trash2 } from 'lucide-react'
import DeleteConfirmation from './components/DeleteConfirmation'

// Libellé du badge selon la profondeur dans l'arbre
const TYPE_LABELS = ['Parent', 'Sous-catégorie', 'Sous-sous-catégorie']

// ==========================================
// Transformer la liste plate de l'API en arbre (parent -> enfants)
// ==========================================
const buildTree = (categories) => {
    const map = {}
    categories.forEach((c) => { // parcourt chaque catégorie
        map[c._id] = { ...c, children: [] }
        /*  { ...c } copie les propriétés de la catégorie dans un nouvel objet.
         children: [] ajoute un tableau vide destiné à recevoir ses sous-catégories. */
    })

    const roots = []
    categories.forEach((c) => {
        // parentCategoryId peut être un objet (populate), un id ou null
        const parentId = c.parentCategoryId?._id ?? c.parentCategoryId
        // si le parent est un objet ou un identifiant 
        if (parentId && map[parentId]) {
            map[parentId].children.push(map[c._id]) // récupères le parent dans map, puis tu ajoutes la catégorie actuelle à son tableau children.
        } else {
            roots.push(map[c._id]) // La catégorie est ajoutée aux racines.
        }
    })
    return roots
}

function Category() {
    // ==========================================
    // Catégories (sous forme d'arbre)
    // ==========================================
    const [categories, setCategories] = useState([])
    // ids des catégories dépliées
    const [expanded, setExpanded] = useState({})
    // delete ouvert ou fermé
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    // Stocker le id et le nom quand on clique sur supprimer
    const [categoryToDelete, setCategoryToDelete] = useState(null)
    const [categoryNameToDelete, setCategoryNameToDelete] = useState("")

    // ==========================================
    // Récupération des catégories
    // ==========================================
    const getCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5001/categories')
            setCategories(buildTree(response.data.data || []))
        } catch (error) {
            toast.error('Impossible de récupérer les catégories.')
        }
    }

    // ==========================================
    // Chargement initial
    // ==========================================
    useEffect(() => {
        getCategories()
    }, [])

    // ==========================================
    // Supprimer une catégorie
    // ==========================================
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5001/categories/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )

            // on recharge la liste pour afficher la suppression sans rafraîchir la page
            getCategories()
            setDeleteDialogOpen(false)
        } catch (error) {
            toast.error("Impossible de supprimer la catégorie.")
            console.log("❌ Erreur suppression catégorie");
            console.log("Status :", error.response?.status);
            console.log("Message backend :", error.response?.data);
            console.log("Erreur complète :", error);
            console.log("Token :", localStorage.getItem("token"));
            console.log("LocalStorage :", Object.keys(localStorage));
            console.log("SessionStorage :", Object.keys(sessionStorage));
        }
    }

    // ==========================================
    // Déplier / replier une catégorie
    // ==========================================
    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
    }

    // ==========================================
    // Affichage récursif d'une ligne et de ses enfants
    // ==========================================
    const renderRow = (c, level = 0) => {
        const hasChildren = c.children.length > 0
        const isOpen = expanded[c._id]

        return (
            <Fragment key={c._id}>
                <TableRow>
                    {/* Nom */}
                    <TableCell>
                        <div className="category__name" style={{ paddingLeft: `${level * 1.5}rem` }}>
                            {/* Chevron (ou flèche pour le dernier niveau) */}
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
                            {/* Image */}
                            {c.image ? (
                                <img src={c.image} alt={c.name} className="category__image" />
                            ) : (
                                <span className="category__image category__image--empty"><ImageOff /></span>
                            )}
                            <span className={level === 0 ? 'category__label category__label--parent' : 'category__label'}>
                                {c.name}
                            </span>
                            <Badge variant="secondary" className="category__type">
                                {TYPE_LABELS[level] ?? TYPE_LABELS[TYPE_LABELS.length - 1]}
                            </Badge>
                        </div>
                    </TableCell>
                    {/* Produits */}
                    <TableCell>{c.countProduct ?? 0}</TableCell>
                    {/* Statut */}
                    <TableCell>
                        <Badge className={c.isActive ? 'category__status--active' : 'category__status--inactive'}>
                            {c.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </TableCell>
                    {/* Actions (logique à venir) */}
                    <TableCell className="produits__actions">
                        <Button variant="ghost" size="icon" aria-label="Modifier"><Pencil /></Button>
                        <Button variant="ghost" size="icon" aria-label="Voir"><Eye /></Button>
                        {/* ICONE SUPPRIMER */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setCategoryToDelete(c._id) // je garde ID de la catégorie
                                setCategoryNameToDelete(c.name) // je garde le nom de la catégorie
                                setDeleteDialogOpen(true) // la boite est en etat ouvert
                            }}
                            aria-label="Supprimer"
                        >
                            <Trash2 />
                        </Button>
                    </TableCell>
                </TableRow>

                {/* Enfants */}
                {hasChildren && isOpen && c.children.map((child) => renderRow(child, level + 1))}
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
                    <Button><Plus />Ajouter une catégorie</Button>
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
                            {/* Aucune catégorie */}
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="produits__empty">Aucune catégorie.</TableCell>
                                </TableRow>
                            )}
                            {/* Catégories */}
                            {categories.map((c) => renderRow(c))}
                        </TableBody>
                    </Table>
                </div>

                {/* Panneau DE SUPPRESSION */}
                <DeleteConfirmation
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={() => handleDelete(categoryToDelete)}
                    categoryName={categoryNameToDelete} // envoyer le nom de la catégorie comme prop
                />
            </Main>
        </>
    )
}

export default Category
