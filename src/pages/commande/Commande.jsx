import { useEffect, useState } from 'react'
import axios from 'axios'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import { FaEye } from "react-icons/fa";
import Pagination from '@mui/material/Pagination'
import CommandeDetail from './components/CommandeDetail'
import { OrderStatusBadge, PaymentStatusBadge } from './components/StatusBadge'
import DeleteConfirmation from './components/DeleteConfirmation'
import '../devis/Devis.css'

function Commande() {
    // ==========================================
    // Commandes
    // ==========================================
    const [orders, setOrders] = useState([])
    // commande sélectionnée + le dialog de voir le détail
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [dialogdetailOpen, setDialogdetailOpen] = useState(false)
    // delete ouvert ou fermé
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    // Stocker le id et le numéro quand on clique sur supprimer
    const [orderToDelete, setOrderToDelete] = useState(null)
    const [orderNumberToDelete, setOrderNumberToDelete] = useState("")

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
    // Récupération des commandes
    // ==========================================
    const getOrders = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5001/orders/admin?page=${page}&limit=${pagination.ordersPerPage}`,
                {
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
    // Chargement initial
    // ==========================================
    useEffect(() => {
        getOrders(1)
    }, [])

    // ==========================================
    // Ouvrir le détail d'une commande
    // ==========================================
    const openDetail = (order) => {
        setSelectedOrder(order)
        setDialogdetailOpen(true)
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
                                <TableRow key={o._id}>
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
                                    <TableCell className="devis__center"><OrderStatusBadge status={o.status} /></TableCell>
                                    {/* statut du paiement */}
                                    <TableCell className="devis__center"><PaymentStatusBadge status={o.paymentStatus} /></TableCell>
                                    {/* Détail de la commande */}
                                    <TableCell className="devis__center devis__eye" onClick={() => openDetail(o)}><FaEye /></TableCell>

                                    {/* Actions */}
                                    <TableCell className="produits__actions">
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
