import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import { FaEye } from "react-icons/fa";
import Pagination from '@mui/material/Pagination'
import CommandeDetail from './components/CommandeDetail'
import { OrderStatusBadge, PaymentStatusBadge } from './components/StatusBadge'
import '../devis/Devis.css'

// nombre de commandes par page
const ORDERS_PER_PAGE = 12

function Commande() {
    // ==========================================
    // Commandes
    // ==========================================
    const [orders, setOrders] = useState([])
    // commande sélectionnée + le dialog de voir le détail
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [dialogdetailOpen, setDialogdetailOpen] = useState(false)

    // ==========================================
    // Pagination
    // ==========================================
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 0,
    })

    // ==========================================
    // Récupération des commandes
    // ==========================================
    const getOrders = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `http://localhost:5001/orders/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )

            setOrders(response.data.data || [])
            setPagination(response.data.pagination || { currentPage: page, totalPages: 0 })
        } catch (error) {
            toast.error("Impossible de récupérer les commandes.")
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucune commande */}
                            {orders.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="produits__empty">Aucune commande.</TableCell>
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
