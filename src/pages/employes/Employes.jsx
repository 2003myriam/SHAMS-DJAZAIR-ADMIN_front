// Page qui affiche tous les employés de l'entreprise (admin + équipe du dashboard) sous forme de cartes.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Plus, Mail, Phone, CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import { usePermission } from '@/hooks/usePermission'
import '../products/Produits.css'
import '../clients/Clients.css'
import './Employes.css'

// Libellés en français des rôles employés
const ROLES = {
    admin: 'Administrateur',
    sales_manager: 'Responsable commercial',
    sales: 'Commercial',
    engineer: 'Ingénieur',
}

function Employes() {
    const navigate = useNavigate()
    const canCreate = usePermission("employees", "create")

    // ==========================================
    // Employés
    // ==========================================
    const [employees, setEmployees] = useState([])

    // ==========================================
    // Récupération des employés
    // ==========================================
    const getEmployees = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/employees`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setEmployees(response.data.data || [])
        } catch (error) {
            toast.error("Impossible de récupérer les employés.")
        }
    }

    // ==========================================
    // Chargement initial
    // ==========================================
    useEffect(() => {
        getEmployees()
    }, [])

    return (
        <>
            <Header />
            <Main>
                {/* Titre + bouton d'ajout */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Employés</h1>
                        <p className="produits__subtitle">
                            {employees.length} employé{employees.length > 1 ? 's' : ''} dans l'équipe de l'entreprise.
                        </p>
                    </div>
                    {canCreate && (
                        <Button onClick={() => navigate('/employes/ajouter')}>
                            <Plus />
                            Ajouter un employé
                        </Button>
                    )}
                </div>

                {/* Aucun employé */}
                {employees.length === 0 && (
                    <p className="employes__empty">Aucun employé.</p>
                )}

                {/* Cartes des employés */}
                <div className="employes__grid">
                    {employees.map((e) => (
                        <div key={e._id} className="employe-card">
                            {/* haut de la carte : avatar + nom + rôle */}
                            <div className="employe-card__head">
                                <span className="employe-card__avatar">
                                    {`${e.firstName?.[0] || ''}${e.lastName?.[0] || ''}`.toUpperCase()}
                                </span>
                                <div className="employe-card__identity">
                                    <p className="employe-card__name">{e.firstName} {e.lastName}</p>
                                    <Badge className={`employe__role employe__role--${e.role}`}>
                                        {ROLES[e.role] || e.role}
                                    </Badge>
                                </div>
                                {/* point vert / gris selon le statut */}
                                <span
                                    className={`employe-card__dot ${e.isActive ? 'employe-card__dot--active' : ''}`}
                                    title={e.isActive ? 'Actif' : 'Inactif'}
                                />
                            </div>

                            {/* informations de contact */}
                            <ul className="employe-card__infos">
                                <li><Mail /> {e.email}</li>
                                <li><Phone /> {e.phone || '—'}</li>
                                <li>
                                    <CalendarDays />
                                    Ajouté le {e.createdAt ? new Date(e.createdAt).toLocaleDateString("fr-FR") : '—'}
                                </li>
                            </ul>

                            {/* statut du compte */}
                            <div className="employe-card__footer">
                                <Badge className={e.isActive ? 'client__status--active' : 'client__status--inactive'}>
                                    {e.isActive ? 'Compte actif' : 'Compte inactif'}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </Main>
        </>
    )
}

export default Employes
