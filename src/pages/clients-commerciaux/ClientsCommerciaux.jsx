// Page des clients commerciaux et des prospects (ajoutés depuis le dashboard, ils ne viennent pas du site).
// La même page sert pour les deux : status = "client" ou "prospect".
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import Pagination from '@mui/material/Pagination'
import '../products/Produits.css'
import '../devis/Devis.css'
import '../clients/Clients.css'
import { CommercialClientSheet } from './components/CommercialClientSheet'
import { usePermission } from '@/hooks/usePermission'

// Titre et paragraphe de la page selon le status
const PAGE_TEXT = {
    client: {
        title: 'Clients commerciaux',
        subtitle: 'Voici la liste des clients commerciaux : les entreprises qui ont déjà travaillé avec nous.',
        empty: 'Aucun client commercial.',
    },
    prospect: {
        title: 'Prospects',
        subtitle: "Voici la liste des prospects : les entreprises qui ne sont pas encore clientes.",
        empty: 'Aucun prospect.',
    },
}

function ClientsCommerciaux({ status }) {

    // ==========================================
    // Permissions (selon le rôle de l'utilisateur connecté)
    // ==========================================
    const canCreate = usePermission("customers", "create")
    // ==========================================
    // Clients commerciaux / prospects
    // ==========================================
    const [clients, setClients] = useState([])

    // ==========================================
    // Ajout : panneau latéral ouvert ou fermé
    // ==========================================
    const [sheetOpen, setSheetOpen] = useState(false)

    // ==========================================
    // Pagination
    // ==========================================
    const [pagination, setPagination] = useState({
        currentPage: 1,
        clientsPerPage: 12,
        totalClients: 0,
        totalPages: 0,
    })

    // ==========================================
    // Récupération des clients selon le status
    // ==========================================
    const getClients = async (page = 1) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/commercial-clients?status=${status}&page=${page}&limit=${pagination.clientsPerPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            setClients(response.data.data || [])
            if (response.data.pagination) setPagination(response.data.pagination)
        } catch (error) {
            toast.error(`Impossible de récupérer les ${PAGE_TEXT[status].title.toLowerCase()}.`)
        }
    }

    // ==========================================
    // Chargement initial + quand on passe de clients à prospects
    // ==========================================
    useEffect(() => {
        getClients(1)
    }, [status])

    const text = PAGE_TEXT[status]

    return (
        <>
            <Header />
            <Main>
                {/* Titre */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">{text.title}</h1>
                        <p className="produits__subtitle">{text.subtitle}</p>
                    </div>
                    <div className="produits__toolbar">
                        {canCreate && (
                          <Button onClick={() => setSheetOpen(true)}>
                              <Plus />
                              {status === 'prospect' ? 'Ajouter un prospect' : 'Ajouter un client'}
                          </Button>
                        )}
                    </div>
                </div>

                {/* Tableau */}
                <div className="produits__table">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom et prénom</TableHead>
                                <TableHead>Poste</TableHead>
                                <TableHead>Entreprise</TableHead>
                                <TableHead>Secteur d'activité</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Numéro de téléphone</TableHead>
                                <TableHead>Adresse</TableHead>
                                <TableHead className="devis__center">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Aucun client */}
                            {clients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} className="produits__empty">{text.empty}</TableCell>
                                </TableRow>
                            )}
                            {/* Clients affichage */}
                            {clients.map((c) => (
                                <TableRow key={c._id}>
                                    {/* nom et prénom */}
                                    <TableCell>
                                        <div className="client__name">
                                            <span className="client__avatar">
                                                {(c.fullName?.[0] || '').toUpperCase()}
                                            </span>
                                            {c.fullName}
                                        </div>
                                    </TableCell>
                                    {/* poste */}
                                    <TableCell>{c.position || '-'}</TableCell>
                                    {/* entreprise */}
                                    <TableCell>{c.companyId?.name || '-'}</TableCell>
                                    {/* secteurs d'activité de l'entreprise (elle peut en avoir plusieurs) */}
                                    <TableCell>
                                        {c.companyId?.activitySectorIds?.length > 0
                                            ? c.companyId.activitySectorIds.map((sector) => (
                                                <Badge key={sector._id} variant="secondary" className="mr-1">{sector.name}</Badge>
                                            ))
                                            : '-'}
                                    </TableCell>
                                    {/* email */}
                                    <TableCell>{c.email || '-'}</TableCell>
                                    {/* phone */}
                                    <TableCell>{c.phone || '-'}</TableCell>
                                    {/* adresse */}
                                    <TableCell>{c.address || '-'}</TableCell>
                                    {/* statut actif / inactif */}
                                    <TableCell className="devis__center">
                                        <Badge className={c.isActive ? 'client__status--active' : 'client__status--inactive'}>
                                            {c.isActive ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="produitback-pagination">
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.currentPage}
                            onChange={(event, page) => getClients(page)}
                            color="primary"
                        />
                    </div>
                )}
            </Main>

            {/* Panneau latéral (ajout) */}
            <CommercialClientSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                status={status}
                onSave={() => getClients(1)}
            />
        </>
    )
}

export default ClientsCommerciaux
