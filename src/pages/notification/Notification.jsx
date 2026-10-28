import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Check, CheckCheck, FileText, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Header } from "@/layouts/header"
import { Main } from "@/layouts/main"
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
    // Marquer comme lue / non lue (bascule isRead)
    // ==========================================
    const toggleRead = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5001/notification/${id}/read`)
            const isRead = response.data.data.isRead
            // on met à jour seulement isRead pour garder les données populées
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead } : n))
            )
        } catch (error) {
            toast.error("Impossible de modifier la notification.")
        }
    }

    // ==========================================
    // Clic sur la carte : aller vers la commande ou le devis
    // ==========================================
    const navigate = useNavigate()

    const openRelated = (notif) => {
        // élément supprimé : rien à ouvrir
        if (!notif.relatedId) return

        // ouvrir une notification la marque comme lue
        if (!notif.isRead) toggleRead(notif._id)

        const related = typeof notif.relatedId === "object" ? notif.relatedId : null
        const id = related?._id || notif.relatedId
        // recherche pour retrouver l'élément même s'il n'est pas sur la 1re page
        const search = notif.type === "commande" ? related?.orderNumber : related?.email
        const params = new URLSearchParams({ id })
        if (search) params.set("search", search)
        // naviguer vers la demande souhaité selon la notif 
        navigate(`/${notif.type === "commande" ? "commande" : "devis"}?${params}`)
    }

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
                        const clickable = Boolean(notif.relatedId)

                        return (
                            <article
                                key={notif._id}
                                className={`notif__card ${!notif.isRead ? "notif__card--unread" : ""} ${clickable ? "notif__card--clickable" : ""}`}
                                onClick={() => openRelated(notif)}
                                onKeyDown={(e) => e.key === "Enter" && openRelated(notif)}
                                role={clickable ? "link" : undefined}
                                tabIndex={clickable ? 0 : undefined}
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

                                {/* stopPropagation : les boutons ne déclenchent pas le clic de la carte */}
                                <div
                                    className="notif__actions"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                >
                                    {/* Marquer comme lue / non lue */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`notif__read ${notif.isRead ? "notif__read--done" : ""}`}
                                        onClick={() => toggleRead(notif._id)}
                                        aria-label={notif.isRead ? "Marquer comme non lue" : "Marquer comme lue"}
                                        title={notif.isRead ? "Marquer comme non lue" : "Marquer comme lue"}
                                    >
                                        {notif.isRead ? <CheckCheck /> : <Check />}
                                    </Button>
                                </div>
                            </article>
                        )
                    })}
                </div>
            </Main>
        </>
    )
}

export default Notification
