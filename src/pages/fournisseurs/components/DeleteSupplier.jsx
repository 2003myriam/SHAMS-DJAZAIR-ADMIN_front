import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"


function DeleteSupplier({ open, onOpenChange, onConfirm, supplierName }) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <AlertDialogContent size="sm">

                <AlertDialogHeader>

                    <AlertDialogTitle>
                        Supprimer ce fournisseur ?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer le fournisseur "{supplierName}" ?
                        Cette action est irréversible.
                    </AlertDialogDescription>

                </AlertDialogHeader>

                <AlertDialogFooter>

                    <AlertDialogCancel variant="outline">
                        Annuler
                    </AlertDialogCancel>

                    <AlertDialogAction
                        variant="destructive"
                        onClick={onConfirm}
                        className="delete-btn"
                    >
                        Supprimer
                    </AlertDialogAction>

                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog >
    )
}

export default DeleteSupplier
