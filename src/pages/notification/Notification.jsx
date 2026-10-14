import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
function Notification() {
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
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Notifications</h1>

            {loading && <p className="text-muted-foreground">Chargement...</p>}

            {!loading && notifications.length === 0 && (
                <p className="text-muted-foreground">Aucune notification</p>
            )}

            {notifications.map((notif) => (
                <Card key={notif._id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">{notif.type}</CardTitle>
                        {!notif.read && <Badge>Nouveau</Badge>}

                    </CardHeader>
                    <CardContent>

                        <p>{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                            {new Date(notif.created_at).toLocaleString("fr-FR")}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default Notification