import { FaBuilding, FaEnvelope, FaPhone, FaUser } from "react-icons/fa"
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
import "./DevisDetail.css"

function DevisDetail({ open, onOpenChange, devis }) {
    if (!devis) return null


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className="devis-detail">
                <DialogHeader>
                    <DialogTitle>Détails de la demande</DialogTitle>
                    <DialogDescription>
                        Informations concernant cette demande de devis.
                    </DialogDescription>
                </DialogHeader>
                <div className="devis-detail__body no-scrollbar">
                    {/* Information personnelle */}
                    <div className="devis-detail__client">
                        <h2 className="devis-detail__label">Destinataire</h2>
                        <p className="devis-detail__name"><FaUser className="devis-detail__icon" />{devis.firstName} {devis.lastName}</p>
                        <p className="devis-detail__info"><FaEnvelope className="devis-detail__icon" />{devis.email}</p>
                        <p className="devis-detail__info"><FaPhone className="devis-detail__icon" />{devis.phone}</p>
                        <p className="devis-detail__info"><FaBuilding className="devis-detail__icon" />{devis.company || "Aucune"}</p>
                    </div>
                    {/* Detail du produit */}
                    <div className="devis-detail__table">
                        <Table>
                            <TableHeader className="devis-detail__table-head">
                                <TableRow>
                                    <TableHead>Produit</TableHead>
                                    <TableHead>Référence</TableHead>
                                    <TableHead className="devis-detail__quantity">Quantité</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* Affichage produit */}
                                {devis.products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>{product.productTitle}</TableCell>
                                        <TableCell>{product.productReference}</TableCell>
                                        <TableCell className="devis-detail__quantity">{product.quantity}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {/* Message */}
                    <div className="devis-detail__message">
                        <h2 className="devis-detail__label">Message</h2>
                        <p>{devis.message}</p>
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

export default DevisDetail
