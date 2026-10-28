import { useEffect, useState } from "react"
import axios from "axios"
import { FileText, ShoppingCart } from "lucide-react"
import { FaEye } from "react-icons/fa"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Header } from "@/layouts/header"
import { Main } from "@/layouts/main"
import CommandeDetail from "../commande/components/CommandeDetail"
import DevisDetail from "../devis/components/DevisDetail"
import "../devis/Devis.css"
import "./Notification.css"

// Formatage de la date (ex : 28/10/2026 14:05)
const formatDate = (date) =>
    new Date(date).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

function Notification() {
    // Liste de toutes les notifications
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    // notification sélectionnée + dialog de détail
    const [selectedNotif, setSelectedNotif] = useState(null)
    const [dialogdetailOpen, setDialogdetailOpen] = useState(false)


    const getNotifications = async () => {
        try {
            const response = await axios.get("http://localhost:5001/notification")
            setNotifications(response.data.data || [])
        } catch (error) {
            toast.error("Impossible de récupérer les notifications.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getNotifications()
    }, [])

    // ==========================================
    // Ouvrir le détail de la commande ou du devis
    // ==========================================
    const openDetail = (notif) => {
        setSelectedNotif(notif)
        setDialogdetailOpen(true)
    }

    // relatedId est un objet seulement si le populate a fonctionné
    const related = selectedNotif?.relatedId && typeof selectedNotif.relatedId === "object"
        ? selectedNotif.relatedId
        : null

    return (
        <>
            <Header />
            <Main>
                {/* Titre */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Notifications</h1>
                        <p className="produits__subtitle">Les nouvelles commandes et demandes de devis.</p>
                    </div>
                </div>

                {loading && <p className="notif__empty">Chargement...</p>}

                {!loading && notifications.length === 0 && (
                    <p className="notif__empty">Aucune notification</p>
                )}

                <div className="notif__list">
                    {notifications.map((notif) => {
                        const isCommande = notif.type === "commande"
                        const hasDetail = notif.relatedId && typeof notif.relatedId === "object"

                        return (
                            <article
                                key={notif._id}
                                className={`notif__card ${!notif.isRead ? "notif__card--unread" : ""}`}
                            >
                                {/* Icône selon le type */}
                                <div className={`notif__icon notif__icon--${notif.type}`}>
                                    {isCommande ? <ShoppingCart /> : <FileText />}
                                </div>

                                <div className="notif__body">
                                    <div className="notif__head">
                                        <span className="notif__type">{isCommande ? "Commande" : "Devis"}</span>
                                        {!notif.isRead && <Badge className="notif__new">Nouveau</Badge>}
                                        <span className="notif__date">{formatDate(notif.created_at)}</span>
                                    </div>

                                    <p className="notif__message">{notif.message}</p>
                                    {notif.relatedId === null && (
                                        <p className="notif__missing">L'élément lié a été supprimé.</p>
                                    )}
                                </div>

                                {/* Voir le détail */}
                                {hasDetail && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="notif__eye"
                                        onClick={() => openDetail(notif)}
                                        aria-label={isCommande ? "Voir la commande" : "Voir le devis"}
                                    >
                                        <FaEye />
                                    </Button>
                                )}
                            </article>
                        )
                    })}
                </div>

                {/* Détail de la commande ou du devis */}
                {selectedNotif?.type === "commande" && (
                    <CommandeDetail
                        open={dialogdetailOpen}
                        onOpenChange={setDialogdetailOpen}
                        order={related}
                    />
                )}
                {selectedNotif?.type === "devis" && (
                    <DevisDetail
                        open={dialogdetailOpen}
                        onOpenChange={setDialogdetailOpen}
                        devis={related}
                    />
                )}
            </Main>
        </>
    )
}

export default Notification
