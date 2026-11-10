// Panneau latéral (Sheet) qui s'ouvre pour ajouter un client commercial ou un prospect.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from '@/components/ui/sheet'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from "sonner"
import '../../marques/Marque.css'
import './CommercialClientSheet.css'
import { CompanySheet } from '../../entreprises/components/CompanySheet'
import { Plus } from 'lucide-react'

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  position: '',
  companyId: '',
  address: '',
  status: 'client',
  isActive: true,
}

// status : "client" ou "prospect" -> pré-sélectionné selon la page ouverte
export function CommercialClientSheet({ open, onOpenChange, status, onSave }) {

  const [form, setForm] = useState(EMPTY_FORM)
  // entreprises (pour choisir l'entreprise du client)
  const [companies, setCompanies] = useState([])
  const [companySheetOpen, setCompanySheetOpen] = useState(false)
  // ==========================================
  // Récupération des entreprises
  // ==========================================
  const getCompanies = async () => {
    try {
      const token = localStorage.getItem("token")
      // la route est paginée : on demande une grande limite pour avoir toutes les entreprises
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/companies?limit=1000`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCompanies(response.data.data || [])
    } catch (error) {
      toast.error("Impossible de récupérer les entreprises.")
    }
  }

  // à chaque ouverture : formulaire vide + liste des entreprises à jour
  useEffect(() => {
    if (!open) return
    setForm({ ...EMPTY_FORM, status })
    getCompanies()
  }, [open, status])

  // SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.companyId) {
      toast.error("Veuillez choisir une entreprise.")
      return
    }

    try {
      const token = localStorage.getItem("token")

      await axios.post(`${import.meta.env.VITE_API_URL}/commercial-clients`, form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success(form.status === 'prospect' ? "Prospect ajouté avec succès" : "Client commercial ajouté avec succès")
      // recharger la liste dans la page parent
      onSave?.()
      onOpenChange(false)

    } catch (error) {
      toast.error(error.response?.data?.message || "Impossible d'ajouter le client.")
    }
  }

  // fonction du 2eme sheet 
  const handleCompanyCreated = (newCompany) => {

    // Ajouter la nouvelle entreprise à la liste
    setCompanies(prev => [...prev, newCompany])

    // Sélectionner automatiquement son ID
    setForm(prev => ({
      ...prev,
      companyId: newCompany._id
    }))

    // Fermer le deuxième Sheet
    setCompanySheetOpen(false)
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent className="produit-sheet">
        {/* header du formulaire  */}
        <SheetHeader className="produit-sheet__header">
          <SheetTitle>
            {status === 'prospect' ? 'Ajouter un prospect' : 'Ajouter un client commercial'}
          </SheetTitle>
          <SheetDescription>
            Remplissez les informations puis cliquez sur Enregistrer.
          </SheetDescription>
        </SheetHeader>

        {/* formulaire ici */}
        <form id="commercial-client-form" onSubmit={handleSubmit} className="produit-sheet__form">

          {/* ================= Contact ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Contact</h3>

            {/* ======== nom et prénom =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="fullName">Nom et prénom</Label>
              <Input
                id="fullName"
                placeholder="Ex : Karim Benali"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>

            {/* ======== poste =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                placeholder="Ex : Responsable achats"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                required
              />
            </div>

            {/* ======== email =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@entreprise.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* ======== téléphone =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                placeholder="Ex : 0555 00 00 00"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
          </section>

          <Separator />

          {/* ================= Entreprise ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Entreprise</h3>

            {/* ======== entreprise =========== */}
            <div className="produit-sheet__field">
              <Label>Entreprise</Label>
              <Select
                value={form.companyId}
                onValueChange={(companyId) => setForm({ ...form, companyId })}
              >
                <SelectTrigger className="produit-sheet__select">
                  <SelectValue placeholder="Choisir une entreprise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* ======== Entreprise introuvable =========== */}
            <div className="commercial-sheet__company-missing">
              <p className="commercial-sheet__company-missing-text">Entreprise introuvable ?</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCompanySheetOpen(true)}
              >
                <Plus size={16} />
                Ajouter une entreprise
              </Button>
            </div>


            {/* ======== adresse =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                placeholder="Adresse du siège"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
            </div>
          </section>

          <Separator />

          {/* ================= Statut ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Statut</h3>

            {/* ======== client ou prospect =========== */}
            <div className="produit-sheet__field">
              <Label>Type</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger className="produit-sheet__select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="client">Client commercial</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* ======== actif =========== */}
            <div className="marque-sheet__checkbox-field">
              <Label htmlFor="isActive">Client actif</Label>
              <Checkbox
                id="isActive"
                className="marque-sheet__checkbox"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
              />
            </div>
          </section>
        </form>

        {/* footer du formulaire  */}
        <SheetFooter className="produit-sheet__footer">
          <SheetClose asChild>
            <Button type="button" variant="outline">Annuler</Button>
          </SheetClose>
          <Button type="submit" form="commercial-client-form">Enregistrer</Button>
        </SheetFooter>

      </SheetContent>
      <CompanySheet
        open={companySheetOpen}
        onOpenChange={setCompanySheetOpen}
        onCompanyCreated={handleCompanyCreated}
      />

    </Sheet>
  )
}
