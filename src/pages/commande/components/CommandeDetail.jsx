import { FaBuilding, FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge"
// mêmes styles que le détail d'un devis
import "../../devis/components/DevisDetail.css"

function CommandeDetail({ open, onOpenChange, order }) {
    if (!order) return null

    const customer = order.customer || {}

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="devis-detail">
                <DialogHeader>
                    <DialogTitle>Commande #{order.orderNumber}</DialogTitle>
                    <DialogDescription>
                        Informations concernant cette commande.
                    </DialogDescription>
                </DialogHeader>
                <div className="devis-detail__body no-scrollbar">
                    {/* Statuts */}
                    <div className="flex gap-6">
                        <div>
                            <h2 className="devis-detail__label">Statut</h2>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <div>
                            <h2 className="devis-detail__label">Paiement</h2>
                            <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                    </div>
                    {/* Information du client */}
                    <div className="devis-detail__client">
                        <h2 className="devis-detail__label">Client</h2>
                        <p className="devis-detail__name"><FaUser className="devis-detail__icon" />{customer.firstName} {customer.lastName}</p>
                        <p className="devis-detail__info"><FaEnvelope className="devis-detail__icon" />{customer.email}</p>
                        <p className="devis-detail__info"><FaPhone className="devis-detail__icon" />{customer.phone}</p>
                        <p className="devis-detail__info"><FaMapMarkerAlt className="devis-detail__icon" />{customer.address}</p>
                        <p className="devis-detail__info"><FaBuilding className="devis-detail__icon" />{customer.company || "Aucune"}</p>
                    </div>
                    {/* Articles de la commande */}
                    <div className="devis-detail__table">
                        <Table>
                            <TableHeader className="devis-detail__table-head">
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>Marque</TableHead>
                                    <TableHead>Référence</TableHead>
                                    <TableHead className="devis-detail__quantity">Quantité</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Affichage des articles */}
                                {order.items.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{item.titre}</TableCell>
                                        <TableCell>{item.marque}</TableCell>
                                        <TableCell>{item.reference || "-"}</TableCell>
                                        <TableCell className="devis-detail__quantity">{item.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="devis-detail__close">Fermer</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CommandeDetail
