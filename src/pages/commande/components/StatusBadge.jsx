import { Badge } from "@/components/ui/badge"
import "./StatusBadge.css"

// Libellés en français des statuts du modèle Order
export const ORDER_STATUS = {
    pending: "En attente",
    confirmed: "Confirmée",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
}

export const PAYMENT_STATUS = {
    pending: "En attente",
    paid: "Payée",
    failed: "Échouée",
    refunded: "Remboursée",
}

export function OrderStatusBadge({ status }) {
    return (
        <Badge variant="outline" className={`status-badge status-badge--${status}`}>
            {ORDER_STATUS[status] || status}
        </Badge>
    )
}

export function PaymentStatusBadge({ status }) {
    return (
        <Badge variant="outline" className={`status-badge status-badge--${status}`}>
            {PAYMENT_STATUS[status] || status}
        </Badge>
    )
}
