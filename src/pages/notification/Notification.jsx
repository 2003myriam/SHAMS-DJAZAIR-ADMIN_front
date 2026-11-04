import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Check, CheckCheck, FileText, ShoppingCart, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"
import { Header } from "@/layouts/header"
import { Main } from "@/layouts/main"
import Pagination from "@mui/material/Pagination"
import { useUnreadRefresh } from "@/context/NotificationsContext"
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
    // filtre actif : "all", "false" (non lues) ou "true" (lues)
    const [filter, setFilter] = useState("all")
    // suppression groupée à confirmer : "all" (toutes), "read" (les lues) ou null (fermé)
    const [confirmDelete, setConfirmDelete] = useState(null)

    // ==========================================
    // Pagination
    // ==========================================
    const [pagination, setPagination] = useState({
        currentPage: 1,
        notifsPerPage: 12,
        totalnotifs: 0,
        totalPages: 0,
    })

    const getNotifications = async (isRead, page = 1) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/notification`,
                {
                    params: {
                        page,
                        limit: pagination.notifsPerPage,
                        ...(isRead === "all" ? {} : { isRead }),
                    }
                }
            );

            setNotifications(response.data.data || []);

            setPagination(
                response.data.pagination || {
                    currentPage: page,
                    notifsPerPage: pagination.notifsPerPage,
                    totalnotifs: 0,
                    totalPages: 0,
                }
            );
        } catch (error) {
            toast.error("Impossible de récupérer les notifications.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getNotifications("all", 1)
    }, [])

    // ==========================================
    // Changement de page (on garde le filtre actif)
    // ==========================================
    const paginateNotifsPage = (event, page) => {
        getNotifications(filter, page)
    }

    // ==========================================
    // Marquer comme lue / non lue (bascule isRead)
    // ==========================================
    const { refreshUnread } = useUnreadRefresh()

    const toggleRead = async (id) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/notification/${id}/read`)
            const isRead = response.data.data.isRead
            if (filter === "all") {
                // on met à jour seulement isRead pour garder les données populées
                setNotifications((prev) =>
                    prev.map((n) => (n._id === id ? { ...n, isRead } : n))
                )
            } else {
                // filtre lues / non lues : la notification doit sortir de la liste
                getNotifications(filter, pagination.currentPage)
            }
            // met à jour les compteurs des sidebars sans recharger la page
            refreshUnread()
        } catch (error) {
            toast.error("Impossible de modifier la notification.")
        }
    }

    // ==========================================
    // Supprimer une notification
    // ==========================================
    const deleteNotif = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/notification/${id}`)
            // si on supprime la dernière notification de la page, on revient à la page précédente
            const page = notifications.length === 1 && pagination.currentPage > 1
                ? pagination.currentPage - 1
                : pagination.currentPage
            getNotifications(filter, page)
            refreshUnread()
            toast.success("Notification supprimée.")
        } catch (error) {
            toast.error("Impossible de supprimer la notification.")
        }
    }

    // ==========================================
    // Supprimer toutes les notifications ou seulement les lues
    // ==========================================
    const deleteMany = async (type) => {
        try {
            const route = type === "all" ? "delete-all" : "delete-read"
            await axios.delete(`${import.meta.env.VITE_API_URL}/notification/${route}`)
            getNotifications(filter, 1)
            refreshUnread()
            toast.success(type === "all" ? "Toutes les notifications ont été supprimées." : "Les notifications lues ont été supprimées.")
        } catch (error) {
            // le backend répond 404 quand il n'y a rien à supprimer
            if (error.response?.status === 404) {
                toast.info("Aucune notification à supprimer.")
            } else {
                toast.error("Impossible de supprimer les notifications.")
            }
        } finally {
            setConfirmDelete(null)
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

                    <div className="notif__toolbar">
                    {/* Filtres : toutes / non lues / lues */}
                    <div className="notif__filters">
                        {[
                            { value: "all", label: "Toutes" },
                            { value: "false", label: "Non lues" },
                            { value: "true", label: "Lues" },
                        ].map((f) => (
                            <button
                                key={f.value}
                                type="button"
                                className={`notif__filter ${filter === f.value ? "notif__filter--active" : ""}`}
                                onClick={() => {
                                    setFilter(f.value)
                                    getNotifications(f.value, 1)
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Suppressions groupées (avec confirmation) */}
                    <Button variant="outline" onClick={() => setConfirmDelete("read")}>
                        <CheckCheck />Supprimer les lues
                    </Button>
                    <Button variant="outline" className="notif__delete-all" onClick={() => setConfirmDelete("all")}>
                        <Trash2 />Tout supprimer
                    </Button>
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
                                    {/* Supprimer la notification */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="notif__delete"
                                        onClick={() => deleteNotif(notif._id)}
                                        aria-label="Supprimer la notification"
                                        title="Supprimer la notification"
                                    >
                                        <Trash2 />
                                    </Button>
                                </div>
                            </article>
                        )
                    })}
                </div>

                {pagination.totalPages > 1 && (
                    <div className="produitback-pagination">
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={paginateNotifsPage}
                            color="primary"
                        />
                    </div>
                )}

                {/* Confirmation des suppressions groupées */}
                <AlertDialog open={confirmDelete !== null} onOpenChange={(open) => !open && setConfirmDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                {confirmDelete === "all" ? "Supprimer toutes les notifications ?" : "Supprimer les notifications lues ?"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                {confirmDelete === "all"
                                    ? "Toutes les notifications, lues et non lues, seront supprimées définitivement."
                                    : "Les notifications déjà lues seront supprimées définitivement."}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction className="notif__confirm-delete" onClick={() => deleteMany(confirmDelete)}>
                                Supprimer
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Main>
        </>
    )
}

export default Notification
