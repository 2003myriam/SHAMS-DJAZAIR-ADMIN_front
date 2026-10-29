import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import '../devis/Devis.css'
import './Clients.css'

// Libellés en français des rôles du modèle User
const ROLES = {
    admin: 'Admin',
    customer: 'Client',
    employee: 'Employé',
}

function Clients() {
    // ==========================================
    // Clients
    // ==========================================
    const [users, setUsers] = useState([])

    // ==========================================
    // Récupération des clients
    // ==========================================
    const getUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:5001/auth`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            setUsers(response.data.data || [])
        } catch (error) {
            toast.error("Impossible de récupérer les clients.")
        }
    }

    // ==========================================
    // Chargement initial
    // ==========================================
    useEffect(() => {
        getUsers()
    }, [])

    return (
        <>
            <Header />
            <Main>
                {/* Titre */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Clients</h1>
                        <p className="produits__subtitle">Voici la liste des clients.</p>
                    </div>
                </div>

                {/* Tableau */}
                <div className="produits__table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom et prénom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Numéro de téléphone</TableHead>
                                <TableHead className="devis__center">Rôle</TableHead>
                                <TableHead className="devis__center">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucun client */}
                            {users.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="produits__empty">Aucun client.</TableCell>
                                </TableRow>
                            )}
                            {/* Clients affichage */}
                            {users.map((u) => (
                                <TableRow key={u._id}>
                                    {/* nom et prénom */}
                                    <TableCell>
                                        <div className="client__name">
                                            <span className="client__avatar">
                                                {`${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase()}
                                            </span>
                                            {u.firstName} {u.lastName}
                                        </div>
                                    </TableCell>
                                    {/* email */}
                                    <TableCell>{u.email}</TableCell>
                                    {/* phone */}
                                    <TableCell>{u.phone}</TableCell>
                                    {/* rôle */}
                                    <TableCell className="devis__center">
                                        <Badge variant="secondary">{ROLES[u.role] || u.role}</Badge>
                                    </TableCell>
                                    {/* statut du compte */}
                                    <TableCell className="devis__center">
                                        <Badge className={u.isActive ? 'client__status--active' : 'client__status--inactive'}>
                                            {u.isActive ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Main>
        </>
    )
}

export default Clients
