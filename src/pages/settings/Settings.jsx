// Page Paramètres (/settings) : affichée dans le layout (sidebars + header).
// Permet à l'utilisateur connecté de voir et modifier son profil
// (routes backend : GET /auth/profile et PATCH /auth/profile).
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import { useAuthStore } from '@/stores/auth-store'
import '../products/Produits.css'
import '../employes/AjouterEmploye.css'
import '../clients/Clients.css'
import './Settings.css'

// Libellés en français des rôles
const ROLES = {
    admin: 'Administrateur',
    sales_manager: 'Responsable commercial',
    sales: 'Commercial',
    engineer: 'Ingénieur',
}

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
}

function Settings() {
    const { auth } = useAuthStore()

    // profil actuel (affiché dans les placeholders)
    const [profile, setProfile] = useState(EMPTY_FORM)
    // ce que l'utilisateur tape (vide au départ)
    const [form, setForm] = useState(EMPTY_FORM)

    // ==========================================
    // Récupération du profil actuel
    // ==========================================
    const getProfile = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setProfile(response.data.data)
        } catch (error) {
            toast.error("Impossible de récupérer votre profil.")
        }
    }

    // ==========================================
    // Chargement initial
    // ==========================================
    useEffect(() => {
        getProfile()
    }, [])

    // ==========================================
    // Modification du profil
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault()

        // on n'envoie que les champs remplis (le backend refuse les champs vides)
        const data = {}
        if (form.firstName.trim()) data.firstName = form.firstName
        if (form.lastName.trim()) data.lastName = form.lastName
        if (form.email.trim()) data.email = form.email
        if (form.phone.trim()) data.phone = form.phone

        try {
            const token = localStorage.getItem("token")
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/auth/profile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            toast.success(response.data.message || "Profil modifié avec succès.")
            // les nouvelles valeurs deviennent les placeholders, et on vide le formulaire
            setProfile({ ...profile, ...response.data.data })
            setForm(EMPTY_FORM)
            // met à jour l'email affiché dans le menu profil du header
            auth.setUser({ ...auth.user, email: response.data.data.email })
        } catch (error) {
            toast.error(error.response?.data?.message || "Impossible de modifier le profil.")
        }
    }

    return (
        <>
            <Header />
            <Main>
                {/* Titre */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Paramètres</h1>
                        <p className="produits__subtitle">
                            Vos informations actuelles sont affichées en gris. Remplissez seulement les champs à modifier.
                        </p>
                    </div>
                </div>

                {/* Formulaire du profil */}
                <form onSubmit={handleSubmit} className="employe-form">
                    <div className="employe-form__row">
                        <div className="employe-form__field">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                                id="firstName"
                                placeholder={profile.firstName}
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            />
                        </div>
                        <div className="employe-form__field">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                                id="lastName"
                                placeholder={profile.lastName}
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="employe-form__field">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={profile.email}
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="employe-form__field">
                        <Label htmlFor="phone">Numéro de téléphone</Label>
                        <Input
                            id="phone"
                            placeholder={profile.phone || "--"}
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    {/* rôle + statut : affichés seulement, non modifiables (ils ne sont pas dans form, donc jamais envoyés) */}
                    <div className="employe-form__row">
                        <div className="employe-form__field">
                            <Label htmlFor="role">Rôle</Label>
                            <Input
                                id="role"
                                value={ROLES[profile.role] || profile.role || ''}
                                disabled
                            />
                        </div>
                        <div className="employe-form__field">
                            <Label>Statut du compte</Label>
                            <div className="settings__status">
                                <Badge className={profile.isActive ? 'client__status--active' : 'client__status--inactive'}>
                                    <span className={`settings__dot ${profile.isActive ? 'settings__dot--active' : ''}`} />
                                    {profile.isActive ? 'Actif' : 'Inactif'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="employe-form__footer">
                        <Button type="button" variant="outline" onClick={() => setForm(EMPTY_FORM)}>
                            Annuler
                        </Button>
                        <Button type="submit">Enregistrer</Button>
                    </div>
                </form>
            </Main>
        </>
    )
}

export default Settings
