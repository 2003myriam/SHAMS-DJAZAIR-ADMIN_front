import { useEffect, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import { FaEye } from "react-icons/fa";
import Pagination from '@mui/material/Pagination'
import CommandeDetail from './components/CommandeDetail'
import { ORDER_STATUS, PAYMENT_STATUS } from './components/StatusBadge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DeleteConfirmation from './components/DeleteConfirmation'
import { CommandeSheet } from './components/CommandeSheet'
import '../devis/Devis.css'
import { SearchIcon, X } from 'lucide-react'
import { Input } from '@/components/ui/input'


function Commande() {
    // ==========================================
    // Commandes
    // ==========================================
    const [orders, setOrders] = useState([])
    // depuis une notification : ?id=<commande à surligner>&search=<n° commande>
    const [searchParams] = useSearchParams()
    const highlightId = searchParams.get('id')
    const [search, setSearch] = useState(searchParams.get('search') || '')
    // filtres : "all" (tous) ou une clé de ORDER_STATUS / PAYMENT_STATUS
    const [statusFilter, setStatusFilter] = useState('all')
    const [paymentFilter, setPaymentFilter] = useState('all')
    // commande sélectionnée + le dialog de voir le détail
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [dialogdetailOpen, setDialogdetailOpen] = useState(false)
    // delete ouvert ou fermé
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    // Stocker le id et le numéro quand on clique sur supprimer
    const [orderToDelete, setOrderToDelete] = useState(null)
    const [orderNumberToDelete, setOrderNumberToDelete] = useState("")

    // ==========================================
    // Panneau latéral (modification)
    // ==========================================
    // panneau ouvert ou fermé
    const [sheetOpen, setSheetOpen] = useState(false)
    // commande en cours de modification
    const [currentOrder, setCurrentOrder] = useState(null)

    // ==========================================
    // Pagination
    // ==========================================
    const [pagination, setPagination] = useState({
        currentPage: 1,
        ordersPerPage: 12,
        totalOrders: 0,
        totalPages: 0,
    })

    // ==========================================
    // Récupération des commandes admin finnalisé
    // ==========================================
    const getOrders = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5001/orders/admin`,
                {
                    params: {
                        page,
                        limit: pagination.ordersPerPage,
                        search,
                        // "all" : pas de filtre
                        ...(statusFilter === 'all' ? {} : { status: statusFilter }),
                        ...(paymentFilter === 'all' ? {} : { paymentStatus: paymentFilter }),
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )

            setOrders(response.data.data || [])

            setPagination(
                response.data.pagination || {
                    currentPage: page,
                    ordersPerPage: pagination.ordersPerPage,
                    totalOrders: 0,
                    totalPages: 0,
                }
            )
        } catch (error) {
            toast.error("Impossible de récupérer les commandes.")
        }
    }

    // ==========================================
    // Modifier le statut ou le paiement d'une commande
    // ==========================================
    // field : "status" (route /status) ou "paymentStatus" (route /payment)
    const updateOrderField = async (id, field, value) => {
        try {
            const token = localStorage.getItem("token");
            const route = field === "status" ? "status" : "payment"
            await axios.patch(`http://localhost:5001/orders/admin/${id}/${route}`,
                { [field]: value },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            // on met à jour la commande dans la liste
            setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, [field]: value } : o)))
            toast.success(field === "status" ? "Statut modifié." : "Paiement modifié.")
        } catch (error) {
            toast.error("Impossible de modifier la commande.")
        }
    }

    // ==========================================
    // supprimer une commande
    // ==========================================
    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5001/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            // si on supprime la dernière commande de la page, on revient à la page précédente
            const page = orders.length === 1 && pagination.currentPage > 1
                ? pagination.currentPage - 1
                : pagination.currentPage
            getOrders(page)
            setDeleteDialogOpen(false)
        } catch (error) {
            toast.error("Impossible de supprimer la commande.")
        }
    }

    // ==========================================
    // Changement de page
    // ==========================================
    const paginateOrdersPage = (event, page) => {
        getOrders(page)
    }

    // ==========================================
    // Chargement initial + à chaque recherche / filtre (retour à la page 1)
    // ==========================================
    useEffect(() => {
        getOrders(1)
    }, [search, statusFilter, paymentFilter])

    // faire défiler jusqu'à la commande venant d'une notification
    useEffect(() => {
        if (highlightId) {
            document.getElementById(`row-${highlightId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [orders, highlightId])

    // ==========================================
    // Ouvrir le détail d'une commande
    // ==========================================
    const openDetail = (order) => {
        setSelectedOrder(order)
        setDialogdetailOpen(true)
    }

    // ==========================================
    // Modifier une commande
    // ==========================================
    const openEdit = (order) => {
        setCurrentOrder(order)
        setSheetOpen(true)
    }

    // ==========================================
    // Après l'enregistrement d'une modification
    // ==========================================
    const handleSave = () => {
        // on recharge la page actuelle pour afficher la commande modifiée
        getOrders(pagination.currentPage)
    }

    return (
        <>
            <Header />
            <Main>
                {/* Titre */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Commandes</h1>
                        <p className="produits__subtitle">Voici la liste des commandes.</p>
                    </div>
                </div>

                {/* Barre d'outils : recherche à gauche, filtres à droite */}
                <div className="devis__toolbar">
                        <div className="produits__search">
                            <SearchIcon className="produits__search-icon" />
                            <Input
                                type="text"
                                placeholder="Numéro ou email du client..."
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
                        {/* Filtre par statut de la commande */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="devis__status-filter">
                                <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                {Object.entries(ORDER_STATUS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        <span className={`status-dot status-dot--${value}`} />{label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* Filtre par statut du paiement */}
                        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                            <SelectTrigger className="devis__status-filter">
                                <SelectValue placeholder="Paiement" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les paiements</SelectItem>
                                {Object.entries(PAYMENT_STATUS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        <span className={`status-dot status-dot--${value}`} />{label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                </div>

                {/* Tableau */}
                <div className="produits__table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>N° commande</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Numéro de téléphone</TableHead>
                                <TableHead className="devis__center">Date de la commande</TableHead>
                                <TableHead className="devis__center">Statut</TableHead>
                                <TableHead className="devis__center">Paiement</TableHead>
                                <TableHead className="devis__center">Détail de la commande</TableHead>
                                <TableHead className="produits__actions">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucune commande */}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="produits__empty">Aucune commande.</TableCell>
                                </TableRow>
                            )}
                            {/* Commandes affichage */}
                            {orders.map((o) => (
                                <TableRow
                                    key={o._id}
                                    id={`row-${o._id}`}
                                    className={o._id === highlightId ? 'row--highlight' : ''}
                                >
                                    {/* numéro */}
                                    <TableCell>#{o.orderNumber}</TableCell>
                                    {/* client */}
                                    <TableCell>{o.customer?.firstName} {o.customer?.lastName}</TableCell>
                                    {/* phone */}
                                    <TableCell>{o.customer?.phone}</TableCell>
                                    {/* date */}
                                    <TableCell className="devis__center">
                                        {new Date(o.created_at).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </TableCell>
                                    {/* statut de la commande */}
                                    <TableCell className="devis__center">
                                        <Select value={o.status} onValueChange={(value) => updateOrderField(o._id, "status", value)}>
                                            <SelectTrigger size="sm" className={`status-select status-badge--${o.status}`}>
                                                <SelectValue placeholder="Statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(ORDER_STATUS).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        <span className={`status-dot status-dot--${value}`} />{label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    {/* statut du paiement */}
                                    <TableCell className="devis__center">
                                        <Select value={o.paymentStatus} onValueChange={(value) => updateOrderField(o._id, "paymentStatus", value)}>
                                            <SelectTrigger size="sm" className={`status-select status-badge--${o.paymentStatus}`}>
                                                <SelectValue placeholder="Paiement" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(PAYMENT_STATUS).map(([value, label]) => (
                                                    <SelectItem key={value} value={value}>
                                                        <span className={`status-dot status-dot--${value}`} />{label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    {/* Détail de la commande */}
                                    <TableCell className="devis__center devis__eye" onClick={() => openDetail(o)}><FaEye /></TableCell>

                                    {/* Actions */}
                                    <TableCell className="produits__actions">
                                        {/* ICONE MODIFIER  */}
                                        <Button variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(o)}
                                            aria-label="Modifier">
                                            <Pencil /></Button>
                                        {/* ICONE SUPPRIMER  */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                setOrderToDelete(o._id) // je garde ID de la commande
                                                setOrderNumberToDelete(o.orderNumber) // je garde le numéro de la commande
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

                <CommandeDetail
                    open={dialogdetailOpen}
                    onOpenChange={setDialogdetailOpen}
                    order={selectedOrder}
                />
                {/* Panneau latéral (modification) */}
                <CommandeSheet
                    open={sheetOpen}
                    onOpenChange={setSheetOpen}
                    order={currentOrder}
                    onSave={handleSave}
                />
                {/* Panneau DE SUPPRESSION */}
                <DeleteConfirmation
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={() => handleDelete(orderToDelete)}
                    orderNumber={orderNumberToDelete} // envoyer le numéro de la commande comme prop
                />

                {pagination.totalPages > 1 && (
                    <div className="produitback-pagination">
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={paginateOrdersPage}
                            color="primary"
                        />
                    </div>
                )}
            </Main>
        </>
    )
}

export default Commande
