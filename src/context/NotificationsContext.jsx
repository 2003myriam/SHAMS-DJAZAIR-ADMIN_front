// Context des notifications : connexion Socket.IO + liste des notifications reçues.
// Accessible dans n'importe quel composant avec useNotifications().
import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { toast } from 'sonner'

// Le "conteneur" partagé : par défaut, une liste vide
const NotificationsContext = createContext([])

export function NotificationsProvider({ children }) {
    const [notifications, setNotifications] = useState([])

    // ==== AFFICHAGE DES NOTIFICATIONS ========
    useEffect(() => {
        // socket io doit se connecter au backend
        const socket = io('http://localhost:5001')

        // connect est un événement interne de Socket.IO :
        // il signifie juste « je suis connecté ». Il ne transporte aucune donnée
        socket.on('connect', () => {
            console.log('Connecté à Socket.IO :', socket.id)
        })

        // On écoute l'événement envoyé par le serveur
        socket.on('notification', (data) => {
            toast.success(data.message, {
                duration: Infinity,          // ne disparaît pas toute seule
                closeButton: true,           // bouton pour la fermer
            })
            // on ajoute la notification à la liste (la plus récente en premier)
            setNotifications((prev) => [data, ...prev])
        })

        socket.on('connect_error', (error) => {
            console.error('Erreur Socket.IO :', error.message)
        })

        // quand le composant est démonté, on ferme la connexion
        // pour éviter les connexions en double
        return () => {
            socket.off('notification')
            socket.disconnect()
        }
    }, [])

    // On rend la liste des notifications disponible à tous les composants enfants
    return (
        <NotificationsContext.Provider value={notifications}>
            {children}
        </NotificationsContext.Provider>
    )
}

// Raccourci pour lire les notifications dans un composant (ex : Header)
export function useNotifications() {
    return useContext(NotificationsContext)
}