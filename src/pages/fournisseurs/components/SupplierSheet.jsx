// Panneau latéral (Sheet) qui s'ouvre pour ajouter un fournisseur.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from '@/components/ui/sheet'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from "sonner"

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  address: '',
  categoryId: '',
  specialties: '', // saisi sous forme de texte : "spé 1, spé 2"
}

export function SupplierSheet({ open, onOpenChange, categories, onSave }) {

  const [form, setForm] = useState(EMPTY_FORM)

  // à chaque ouverture : formulaire vide
  useEffect(() => {
    if (open) setForm(EMPTY_FORM)
  }, [open])

  // SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      await axios.post(
        `${import.meta.env.VITE_API_URL}/suppliers`,
        {
          ...form,
          categoryId: form.categoryId || null,
          // "spé 1, spé 2" -> ["spé 1", "spé 2"]
          specialties: form.specialties.split(',').map((sp) => sp.trim()).filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success("Fournisseur ajouté avec succès")
      // recharger la liste des fournisseurs dans la page parent
      onSave?.()
      onOpenChange(false)

    } catch (error) {
      toast.error(error.response?.data?.message || "Impossible d'ajouter le fournisseur.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent className="produit-sheet">
        {/* header du formulaire  */}
        <SheetHeader className="produit-sheet__header">
          <SheetTitle>Ajouter un fournisseur</SheetTitle>
          <SheetDescription>
            Remplissez les informations puis cliquez sur Enregistrer.
          </SheetDescription>
        </SheetHeader>

        {/* formulaire ici */}
        <form id="supplier-form" onSubmit={handleSubmit} className="produit-sheet__form">

          {/* ================= Informations générales ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Informations générales</h3>

            {/* ======== nom =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                placeholder="Nom du fournisseur"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* ======== email =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@fournisseur.com"
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
              />
            </div>

            {/* ======== adresse =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                placeholder="Adresse du fournisseur"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </section>

          <Separator />

          {/* ================= Activité ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Activité</h3>

            {/* ======== catégorie =========== */}
            <div className="produit-sheet__field">
              <Label>Catégorie</Label>
              <Select
                value={form.categoryId}
                onValueChange={(categoryId) => setForm({ ...form, categoryId })}
              >
                <SelectTrigger className="produit-sheet__select">
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* ======== spécialités =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="specialties">Spécialités</Label>
              <Input
                id="specialties"
                placeholder="Séparées par des virgules : variateurs, capteurs"
                value={form.specialties}
                onChange={(e) => setForm({ ...form, specialties: e.target.value })}
              />
            </div>
          </section>
        </form>

        {/* footer du formulaire  */}
        <SheetFooter className="produit-sheet__footer">
          <SheetClose asChild>
            <Button type="button" variant="outline">Annuler</Button>
          </SheetClose>
          <Button type="submit" form="supplier-form">Enregistrer</Button>
        </SheetFooter>

      </SheetContent>

    </Sheet>
  )
}
