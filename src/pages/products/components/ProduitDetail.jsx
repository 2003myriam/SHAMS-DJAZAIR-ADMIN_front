import { useEffect, useState } from "react"
import axios from "axios"
import { FileText, ImageOff } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
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
import "./ProduitDetail.css"

// Transforme une clé technique en libellé lisible
// ex : "tensionAlimentation" -> "Tension alimentation", "indiceProtectionIP" -> "Indice protection IP"
const formatLabel = (key) => {
    const text = key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(" ")
        .map((word) => (word === word.toUpperCase() ? word : word.toLowerCase()))
        .join(" ")
    return text.charAt(0).toUpperCase() + text.slice(1)
}

function ProduitDetail({ open, onOpenChange, productId }) {
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(false)

    // ==========================================
    // Récupération du produit à l'ouverture
    // ==========================================
    useEffect(() => {
        if (!open || !productId) return

        const getProduct = async () => {
            setLoading(true)
            try {
                const response = await axios.get(`http://localhost:5001/products/${productId}`)
                setProduct(response.data.data)
            } catch (error) {
                toast.error("Impossible de récupérer le produit.")
            } finally {
                setLoading(false)
            }
        }
        getProduct()
    }, [open, productId])

    const specs = Object.entries(product?.technicalSpecifications || {})

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="produit-detail">
                {loading || !product ? (
                    <>
                        <DialogHeader className="sr-only">
                            <DialogTitle>Détail du produit</DialogTitle>
                            <DialogDescription>Chargement</DialogDescription>
                        </DialogHeader>
                        <p className="produit-detail__loading">Chargement...</p>
                    </>
                ) : (
                    <>
                        <div className="produit-detail__body no-scrollbar">
                            {/* Image + informations principales */}
                            <div className="produit-detail__top">
                                <div className="produit-detail__image">
                                    {product.image ? (
                                        <img src={product.image} alt={product.titre} />
                                    ) : (
                                        <ImageOff className="produit-detail__no-image" />
                                    )}
                                </div>

                                <div className="produit-detail__info">
                                    <div className="produit-detail__tags">
                                        {product.brandId?.name && <Badge>{product.brandId.name}</Badge>}
                                        {product.categoryId?.name && (
                                            <Badge variant="secondary">{product.categoryId.name}</Badge>
                                        )}
                                    </div>

                                    <DialogHeader className="text-left">
                                        <DialogTitle className="produit-detail__title">{product.titre}</DialogTitle>
                                        <DialogDescription>
                                            Réf. <span className="produit-detail__ref">{product.reference || "—"}</span>
                                        </DialogDescription>
                                    </DialogHeader>

                                    {product.description && (
                                        <p className="produit-detail__description">{product.description}</p>
                                    )}

                                    {/* Fiche technique PDF */}
                                    {product.datasheet && (
                                        <Button asChild variant="outline" className="produit-detail__datasheet">
                                            <a href={product.datasheet} target="_blank" rel="noreferrer">
                                                <FileText />Fiche technique (PDF)
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Caractéristiques techniques */}
                            <section>
                                <h3 className="produit-detail__label">Caractéristiques techniques</h3>
                                {specs.length === 0 ? (
                                    <p className="produit-detail__empty">Aucune caractéristique renseignée.</p>
                                ) : (
                                    <dl className="produit-detail__specs">
                                        {specs.map(([key, value]) => (
                                            <div key={key} className="produit-detail__spec">
                                                <dt>{formatLabel(key)}</dt>
                                                <dd>{String(value)}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                )}
                            </section>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="produit-detail__close">Fermer</Button>
                            </DialogClose>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ProduitDetail
