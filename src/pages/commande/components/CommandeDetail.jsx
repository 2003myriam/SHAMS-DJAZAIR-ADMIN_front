import { Building2, Mail, MapPin, Phone, ShoppingBag } from "lucide-react"
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
import { OrderStatusBadge, PaymentStatusBadge } from "./StatusBadge"
// mêmes styles que le détail d'un devis
import "../../devis/components/DevisDetail.css"

// Initiales du client pour l'avatar (ex : Jean Dupont -> JD)
const getInitials = (firstName, lastName) =>
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?"

// Date de création (ex : 28 octobre 2026)
const formatLongDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

function CommandeDetail({ open, onOpenChange, order }) {
    if (!order) return null

    const customer = order.customer || {}

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="devis-detail">
                {/* En-tête */}
                <DialogHeader className="devis-detail__header">
                    <div className="devis-detail__header-icon"><ShoppingBag /></div>
                    <div>
                        <DialogTitle>Commande #{order.orderNumber}</DialogTitle>
                        <DialogDescription>
                            {order.created_at ? `Passée le ${formatLongDate(order.created_at)}` : "Informations concernant cette commande."}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="devis-detail__body no-scrollbar">
                    {/* Statuts */}
                    <div className="devis-detail__summary">
                        <div className="devis-detail__summary-item">
                            <span className="devis-detail__muted">Statut</span>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <div className="devis-detail__summary-item">
                            <span className="devis-detail__muted">Paiement</span>
                            <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                        <div className="devis-detail__summary-item">
                            <span className="devis-detail__muted">Articles</span>
                            <span className="devis-detail__summary-value">{order.items.length}</span>
                        </div>
                    </div>

                    {/* Information du client */}
                    <section className="devis-detail__section">
                        <h3 className="devis-detail__label">Client</h3>
                        <div className="devis-detail__person">
                            <span className="devis-detail__avatar">{getInitials(customer.firstName, customer.lastName)}</span>
                            <div className="min-w-0">
                                <p className="devis-detail__name">{customer.firstName} {customer.lastName}</p>
                                <p className="devis-detail__muted">{customer.email}</p>
                            </div>
                        </div>
                        <dl className="devis-detail__grid">
                            <div className="devis-detail__field">
                                <dt><Mail /> Email</dt>
                                <dd>{customer.email}</dd>
                            </div>
                            <div className="devis-detail__field">
                                <dt><Phone /> Téléphone</dt>
                                <dd>{customer.phone}</dd>
                            </div>
                            <div className="devis-detail__field">
                                <dt><Building2 /> Entreprise</dt>
                                <dd>{customer.company || "—"}</dd>
                            </div>
                            <div className="devis-detail__field devis-detail__field--full">
                                <dt><MapPin /> Adresse</dt>
                                <dd>{customer.address || "—"}</dd>
                            </div>
                        </dl>
                    </section>

                    {/* Articles de la commande */}
                    <section className="devis-detail__section">
                        <h3 className="devis-detail__label">
                            Articles
                            <span className="devis-detail__count">{order.items.length}</span>
                        </h3>
                        <ul className="devis-detail__items">
                            {/* Affichage des articles */}
                            {order.items.map((item) => (
                                <li key={item._id} className="devis-detail__item">
                                    <div className="min-w-0">
                                        <p className="devis-detail__item-title">{item.titre}</p>
                                        <p className="devis-detail__muted">
                                            {item.marque}{item.reference ? ` · Réf. ${item.reference}` : ""}
                                        </p>
                                    </div>
                                    <span className="devis-detail__quantity">× {item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="devis-detail__close">Fermer</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CommandeDetail
