import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

function DevisDetail({ open, onOpenChange, devis }) {
    if (!devis) return null


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>  Détails de la demande</DialogTitle>
                    <DialogDescription>
                        Informations concernant cette demande de devis.
                    </DialogDescription>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    {/* Information personnelle */}
                    <h2>DESTINATAIRE</h2>
                    <p>{devis.firstName} {devis.lastName}</p>
                    <p>{devis.email}</p>
                    <p>{devis.phone}</p>
                    <p>{devis.company || "Aucune"}</p>
                    {/* Detail du produit */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produit</TableHead>
                                <TableHead>Référence</TableHead>
                                <TableHead>Quantité</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Affuichage produit */}
                            {devis.products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.productTitle}</TableCell>
                                    <TableCell>{product.productReference}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <p>{devis.message}</p>


                </div>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline">Close</Button>} />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DevisDetail