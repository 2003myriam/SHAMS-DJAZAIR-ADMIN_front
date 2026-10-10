import { useEffect, useState } from 'react'
import axios from 'axios'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import { MarqueSheet } from './components/MarqueSheet'
import { Checkbox } from "@/components/ui/checkbox"
import './Marque.css'
import DeleteConfirmation from './components/DeleteConfirmation'

function Marque() {
    // ==========================================
    // Marque
    // ==========================================
    const [marques, setMarques] = useState([])

    // ==========================================
    // Panneau latéral (ajout / modification)
    // ==========================================
    // panneau ouvert ou fermé
    const [sheetOpen, setSheetOpen] = useState(false)
    // delete ouvert ou fermé
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    // Stocker le nom et le id  quand on clique sur supprimer
    const [brandToDelete, setBrandToDelete] = useState(null)
    const [brandNameToDelete, setBrandNameToDelete] = useState("")
    // marque en cours de modification (null = création)
    const [currentBrand, setCurrentBrand] = useState(null)

    // ==========================================
    // Récupération des marques
    // ==========================================
    const getBrands = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/brand`)
            setMarques(response.data.data || [])
        } catch (error) {
            toast.error("Impossible de récupérer les marques.")
        }
    }

    // ==========================================
    // Chargement initial
    // ==========================================
    useEffect(() => {
        getBrands()
    }, [])

    // ==========================================
    // Ajouter une marque
    // ==========================================
    const openCreate = () => {
        setCurrentBrand(null)
        setSheetOpen(true)
    }

    // ==========================================
    // Modifier une marque
    // ==========================================
    const openEdit = (brand) => {
        setCurrentBrand(brand)
        setSheetOpen(true)
    }
    // ==========================================
    // supprimer une marque
    // ==========================================
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`http://localhost:5001/brand/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            getBrands(),
                setDeleteDialogOpen(false)
        } catch (error) {


            toast.error("Impossible de supprimer la marque.")
        }
    }


    // ==========================================
    // Après l'enregistrement d'une modification la modification s'affiche sans rafrechir la page
    // ==========================================
    const handleSave = () => {
        // on recharge la page actuelle pour afficher la commande modifiée
        getBrands()
    }

    return (
        <>
            <Header />
            <Main>
                {/* Titre + bouton */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Marques</h1>
                        <p className="produits__subtitle">Voici la liste de vos marque industrielles.</p>
                    </div>
                    <Button onClick={openCreate}><Plus />Ajouter une marque</Button>
                </div>

                {/* Tableau */}
                <div className="produits__table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Logo</TableHead>
                                <TableHead>Titre</TableHead>
                                <TableHead>Site web</TableHead>
                                <TableHead>Active</TableHead>
                                <TableHead className="produits__actions">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucun produit */}
                            {marques.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="produits__empty">Aucune marque.</TableCell>
                                </TableRow>
                            )}
                            {/* Produits */}
                            {marques.map((b) => (
                                <TableRow key={b._id}>
                                    {/* logo */}
                                    <TableCell>
                                        {b.logo ? <img src={b.logo} alt={b.name} className="marque__logo" /> : <span>Pas d'image</span>}
                                    </TableCell>
                                    {/* Titre */}
                                    <TableCell>{b.name}</TableCell>
                                    {/* site web */}
                                    <TableCell>{b.website}</TableCell>
                                    {/* is active */}
                                    <TableCell><Checkbox
                                        id="finder-pref-9k2-hard-disks-ljj-checkbox"
                                        name="finder-pref-9k2-hard-disks-ljj-checkbox"
                                        checked={b.isActive}
                                    /></TableCell>
                                    {/* Actions */}
                                    <TableCell className="produits__actions">
                                        {/* ICONE MODIFIER  */}
                                        <Button variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(b)}
                                            aria-label="Modifier">
                                            <Pencil /></Button>
                                        {/* ICONE SUPPRIMER  */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setBrandToDelete(b._id) // je garde ID de la marque
                                                setBrandNameToDelete(b.name) // je garde nom de la marque 
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
            </Main >

            {/* Panneau latéral (ajout / modification) */}
            < MarqueSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                marque={currentBrand}
                onSave={handleSave} />
            {/* Panneau DE SUPPRESION */}
            < DeleteConfirmation
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={() => handleDelete(brandToDelete)}
                brandName={brandNameToDelete} // envoyer le nom de la marque comme prop
            />
        </>
    )
}

export default Marque
