import { Building2, FileText, Mail, Phone } from "lucide-react"
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
import "./DevisDetail.css"

// Initiales du client pour l'avatar (ex : Jean Dupont -> JD)
const getInitials = (firstName, lastName) =>
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?"

// Date de création (ex : 28 octobre 2026)
const formatLongDate = (date) =>
    new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

function DevisDetail({ open, onOpenChange, devis }) {
    if (!devis) return null


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="devis-detail">
                {/* En-tête */}
                <DialogHeader className="devis-detail__header">
                    <div className="devis-detail__header-icon"><FileText /></div>
                    <div>
                        <DialogTitle>Demande de devis</DialogTitle>
                        <DialogDescription>
                            {devis.created_at ? `Reçue le ${formatLongDate(devis.created_at)}` : "Informations concernant cette demande de devis."}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="devis-detail__body no-scrollbar">
                    {/* Information personnelle */}
                    <section className="devis-detail__section">
                        <h3 className="devis-detail__label">Client</h3>
                        <div className="devis-detail__person">
                            <span className="devis-detail__avatar">{getInitials(devis.firstName, devis.lastName)}</span>
                            <div className="min-w-0">
                                <p className="devis-detail__name">{devis.firstName} {devis.lastName}</p>
                                <p className="devis-detail__muted">{devis.email}</p>
                            </div>
                        </div>
                        <dl className="devis-detail__grid">
                            <div className="devis-detail__field">
                                <dt><Mail /> Email</dt>
                                <dd>{devis.email}</dd>
                            </div>
                            <div className="devis-detail__field">
                                <dt><Phone /> Téléphone</dt>
                                <dd>{devis.phone}</dd>
                            </div>
                            <div className="devis-detail__field">
                                <dt><Building2 /> Entreprise</dt>
                                <dd>{devis.company || "—"}</dd>
                            </div>
                        </dl>
                    </section>

                    {/* Detail du produit */}
                    <section className="devis-detail__section">
                        <h3 className="devis-detail__label">
                            Produits demandés
                            <span className="devis-detail__count">{devis.products.length}</span>
                        </h3>
                        <ul className="devis-detail__items">
                            {/* Affichage produit */}
                            {devis.products.map((product) => (
                                <li key={product._id} className="devis-detail__item">
                                    <div className="min-w-0">
                                        <p className="devis-detail__item-title">{product.productTitle}</p>
                                        <p className="devis-detail__muted">Réf. {product.productReference || "—"}</p>
                                    </div>
                                    <span className="devis-detail__quantity">× {product.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Message */}
                    {devis.message && (
                        <section className="devis-detail__section">
                            <h3 className="devis-detail__label">Message</h3>
                            <p className="devis-detail__message">{devis.message}</p>
                        </section>
                    )}
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

export default DevisDetail
