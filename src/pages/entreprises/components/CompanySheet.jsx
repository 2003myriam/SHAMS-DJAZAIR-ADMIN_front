// Panneau latéral (Sheet) qui s'ouvre pour ajouter ou modifier une entreprise.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from '@/components/ui/sheet'
import { toast } from "sonner"
import '../../marques/Marque.css'

const EMPTY_FORM = {
    name: '',
    email: '',
    phone: '',
    description: '',
    address: '',
    website: '',
    socialNetworks: {
        instagram: '',
        facebook: '',
        linkedin: '',
    },
    workingHours: '',
    NIF: '',
    NIS: '',
    RC: '',
    activitySectorIds: [], // une entreprise peut avoir plusieurs secteurs
    isActive: true,
}

// entreprise venant du backend -> valeurs du formulaire
const toForm = (company) =>
    company
        ? {
            name: company.name || '',
            email: company.email || '',
            phone: company.phone || '',
            description: company.description || '',
            address: company.address || '',
            website: company.website || '',
            socialNetworks: {
                instagram: company.socialNetworks?.instagram || '',
                facebook: company.socialNetworks?.facebook || '',
                linkedin: company.socialNetworks?.linkedin || '',
            },
            workingHours: company.workingHours || '',
            NIF: company.NIF || '',
            NIS: company.NIS || '',
            RC: company.RC || '',
            // les secteurs arrivent "populate" ({ _id, name }) -> on garde juste les id
            activitySectorIds: (company.activitySectorIds || []).map((sector) => sector._id || sector),
            isActive: company.isActive ?? true,
        }
        : EMPTY_FORM

// company : null = création / une entreprise = modification
export function CompanySheet({ open, onOpenChange, company, onCompanyCreated }) {

    const [form, setForm] = useState(EMPTY_FORM)
    // secteurs d'activité (pour les cases à cocher)
    const [sectors, setSectors] = useState([])

    // ==========================================
    // Récupération des secteurs d'activité
    // ==========================================
    const getSectors = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/activity-sectors`)
            setSectors(response.data.data || [])
        } catch (error) {
            toast.error("Impossible de récupérer les secteurs d'activité.")
        }
    }

    // à chaque ouverture : formulaire vide (ajout) ou rempli (modification) + secteurs à jour
    useEffect(() => {
        if (!open) return
        setForm(toForm(company))
        getSectors()
    }, [open, company])

    // cocher / décocher un secteur
    const toggleSector = (id, checked) => {
        setForm({
            ...form,
            activitySectorIds: checked
                ? [...form.activitySectorIds, id]
                : form.activitySectorIds.filter((sectorId) => sectorId !== id),
        })
    }

    // modifier un réseau social
    const setSocialNetwork = (network, value) => {
        setForm({
            ...form,
            socialNetworks: { ...form.socialNetworks, [network]: value },
        })
    }

    // SOUMISSION DU FORMULAIRE
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem("token")

            const headers = { Authorization: `Bearer ${token}` }
            let response

            if (company) {
                // MODIFICATION
                response = await axios.put(`${import.meta.env.VITE_API_URL}/companies/${company._id}`, form, { headers })
                toast.success("Entreprise modifiée avec succès")
            } else {
                // CRÉATION
                response = await axios.post(`${import.meta.env.VITE_API_URL}/companies`, form, { headers })
                toast.success("Entreprise ajoutée avec succès")
            }

            // envoyer l'entreprise au parent (recharger la liste / sélection automatique)
            onCompanyCreated?.(response.data.data)
            onOpenChange(false)

        } catch (error) {
            toast.error(error.response?.data?.message || "Impossible d'enregistrer l'entreprise.")
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>

            <SheetContent className="produit-sheet">
                {/* header du formulaire  */}
                <SheetHeader className="produit-sheet__header">
                    <SheetTitle>{company ? "Modifier l'entreprise" : 'Ajouter une entreprise'}</SheetTitle>
                    <SheetDescription>
                        Remplissez les informations puis cliquez sur Enregistrer.
                    </SheetDescription>
                </SheetHeader>

                {/* formulaire ici */}
                <form id="company-form" onSubmit={handleSubmit} className="produit-sheet__form">

                    {/* ================= Informations générales ================= */}
                    <section className="produit-sheet__section">
                        <h3 className="produit-sheet__section-title">Informations générales</h3>

                        {/* ======== nom =========== */}
                        <div className="produit-sheet__field">
                            <Label htmlFor="company-name">Nom</Label>
                            <Input
                                id="company-name"
                                placeholder="Nom de l'entreprise"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* ======== description =========== */}
                        <div className="produit-sheet__field">
                            <Label htmlFor="company-description">Description</Label>
                            <Textarea
                                id="company-description"
                                placeholder="Activité de l'entreprise..."
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        {/* ======== horaires =========== */}
                        <div className="produit-sheet__field">
                            <Label htmlFor="company-hours">Horaires de travail</Label>
                            <Input
                                id="company-hours"
                                placeholder="Ex : Dim - Jeu, 8h - 17h"
                                value={form.workingHours}
                                onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                            />
                        </div>

                        {/* ======== active =========== */}
                        <div className="marque-sheet__checkbox-field">
                            <Label htmlFor="company-active">Entreprise active</Label>
                            <Checkbox
                                id="company-active"
                                className="marque-sheet__checkbox"
                                checked={form.isActive}
                                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                            />
                        </div>
                    </section>

                    <Separator />

                    {/* ================= Coordonnées ================= */}
                    <section className="produit-sheet__section">
                        <h3 className="produit-sheet__section-title">Coordonnées</h3>

                        {/* ======== email =========== */}
                        <div className="produit-sheet__field">
                            <Label htmlFor="company-email">Email</Label>
                            <Input
                                id="company-email"
                                type="email"
                                placeholder="contact@entreprise.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* ======== téléphone =========== */}
                        <div className="produit-sheet__field">
                            <Label htmlFor="company-phone">Numéro de téléphone</Label>
                            <Input
                                id="company-phone"
                                placeholder="Ex : 023 00 00 00"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>

                        {/* ======== adresse =========== */}
                        <div className="produit-sheet__field">
                            <Label htmlFor="company-address">Adresse</Label>
                            <Input
                                id="company-address"
                                placeholder="Adresse de l'entreprise"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                required
                            />
                        </div>

                        {/* ======== site web =========== */}
                        <div className="produit-sheet__field">
                            <Label htmlFor="company-website">Site web</Label>
                            <Input
                                id="company-website"
                                placeholder="https://..."
                                value={form.website}
                                onChange={(e) => setForm({ ...form, website: e.target.value })}
                            />
                        </div>
                    </section>

                    <Separator />

                    {/* ================= Réseaux sociaux ================= */}
                    <section className="produit-sheet__section">
                        <h3 className="produit-sheet__section-title">Réseaux sociaux</h3>

                        <div className="produit-sheet__field">
                            <Label htmlFor="company-instagram">Instagram</Label>
                            <Input
                                id="company-instagram"
                                placeholder="https://instagram.com/..."
                                value={form.socialNetworks.instagram}
                                onChange={(e) => setSocialNetwork('instagram', e.target.value)}
                            />
                        </div>

                        <div className="produit-sheet__field">
                            <Label htmlFor="company-facebook">Facebook</Label>
                            <Input
                                id="company-facebook"
                                placeholder="https://facebook.com/..."
                                value={form.socialNetworks.facebook}
                                onChange={(e) => setSocialNetwork('facebook', e.target.value)}
                            />
                        </div>

                        <div className="produit-sheet__field">
                            <Label htmlFor="company-linkedin">LinkedIn</Label>
                            <Input
                                id="company-linkedin"
                                placeholder="https://linkedin.com/company/..."
                                value={form.socialNetworks.linkedin}
                                onChange={(e) => setSocialNetwork('linkedin', e.target.value)}
                            />
                        </div>
                    </section>

                    <Separator />

                    {/* ================= Informations fiscales ================= */}
                    <section className="produit-sheet__section">
                        <h3 className="produit-sheet__section-title">Informations fiscales</h3>

                        <div className="produit-sheet__field">
                            <Label htmlFor="company-nif">NIF</Label>
                            <Input
                                id="company-nif"
                                placeholder="Numéro d'identification fiscale"
                                value={form.NIF}
                                onChange={(e) => setForm({ ...form, NIF: e.target.value })}
                            />
                        </div>

                        <div className="produit-sheet__field">
                            <Label htmlFor="company-nis">NIS</Label>
                            <Input
                                id="company-nis"
                                placeholder="Numéro d'identification statistique"
                                value={form.NIS}
                                onChange={(e) => setForm({ ...form, NIS: e.target.value })}
                            />
                        </div>

                        <div className="produit-sheet__field">
                            <Label htmlFor="company-rc">RC</Label>
                            <Input
                                id="company-rc"
                                placeholder="Registre de commerce"
                                value={form.RC}
                                onChange={(e) => setForm({ ...form, RC: e.target.value })}
                            />
                        </div>
                    </section>

                    <Separator />

                    {/* ================= Secteurs d'activité ================= */}
                    <section className="produit-sheet__section">
                        <h3 className="produit-sheet__section-title">Secteurs d'activité</h3>

                        {sectors.length === 0 && <p>Aucun secteur d'activité.</p>}
                        {sectors.map((sector) => (
                            <div key={sector._id} className="marque-sheet__checkbox-field">
                                <Label htmlFor={`sector-${sector._id}`}>{sector.name}</Label>
                                <Checkbox
                                    id={`sector-${sector._id}`}
                                    className="marque-sheet__checkbox"
                                    checked={form.activitySectorIds.includes(sector._id)}
                                    onCheckedChange={(checked) => toggleSector(sector._id, checked)}
                                />
                            </div>
                        ))}
                    </section>
                </form>

                {/* footer du formulaire  */}
                <SheetFooter className="produit-sheet__footer">
                    <SheetClose asChild>
                        <Button type="button" variant="outline">Annuler</Button>
                    </SheetClose>
                    <Button type="submit" form="company-form">Enregistrer</Button>
                </SheetFooter>

            </SheetContent>

        </Sheet>
    )
}
