// Page avec un formulaire pour créer un compte employé.
// Le mot de passe temporaire est généré par le backend et envoyé par email à l'employé.
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'
import '../products/Produits.css'
import './AjouterEmploye.css'

// Rôles autorisés par le backend pour un employé
const ROLES = {
    sales_manager: 'Responsable commercial',
    sales: 'Commercial',
    engineer: 'Ingénieur',
}

const EMPTY_FORM = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
}

function AjouterEmploye() {
    const [form, setForm] = useState(EMPTY_FORM)

    // ==========================================
    // Création de l'employé
    // ==========================================
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!form.role) {
            toast.error("Veuillez choisir un rôle.")
            return
        }

        try {
            const token = localStorage.getItem("token")
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/employee/register`, form, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(response.data.message || "Employé créé avec succès.")
            // vider le formulaire pour pouvoir en ajouter un autre
            setForm(EMPTY_FORM)
        } catch (error) {
            toast.error(error.response?.data?.message || "Impossible de créer l'employé.")
        }
    }

    return (
        <>
            <Header />
            <Main>
                {/* Titre */}
                <div className="produits__top">
                    <div>
                        <h1 className="produits__title">Ajouter un employé</h1>
                        <p className="produits__subtitle">
                            Un mot de passe temporaire sera envoyé par email à l'employé.
                        </p>
                    </div>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="employe-form">
                    <div className="employe-form__row">
                        <div className="employe-form__field">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input
                                id="firstName"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="employe-form__field">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input
                                id="lastName"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="employe-form__field">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="prenom.nom@shamesdjazair.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="employe-form__field">
                        <Label htmlFor="phone">Numéro de téléphone</Label>
                        <Input
                            id="phone"
                            placeholder="Ex : 0555 00 00 00"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    <div className="employe-form__field">
                        <Label>Rôle</Label>
                        <Select value={form.role} onValueChange={(role) => setForm({ ...form, role })}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choisir un rôle" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {Object.entries(ROLES).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="employe-form__footer">
                        <Button type="button" variant="outline" onClick={() => setForm(EMPTY_FORM)}>
                            Vider
                        </Button>
                        <Button type="submit">Créer l'employé</Button>
                    </div>
                </form>
            </Main>
        </>
    )
}

export default AjouterEmploye
