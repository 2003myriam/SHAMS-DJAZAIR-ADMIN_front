// Panneau latéral (Sheet) qui s'ouvre pour ajouter ou modifier un produit.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FileText, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, } from '@/components/ui/select'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from '@/components/ui/sheet'

const EMPTY_FORM = {
  name: '',
  logo: '',
  isActive: false,
  website: '',

}
export function MarqueSheet({ open, onOpenChange, marque, onSave }) {

  const [form, setForm] = useState(marque ?? EMPTY_FORM) // Si marque existe, prends produit. Sinon, prends EMPTY_FORM.
  // Fichiers choisis (pour afficher leur nom)
  const [imageFile, setImageFile] = useState(null)

  // SOUMISSION DU FORMULAIRE 
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      const response = await axios.post(
        "http://localhost:5001/brand",
        finalForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log("Marque créé :", response.data)

      setForm(response.data.data)
    }
    catch (error) {
      console.log("Erreur lors de la création de la marque :", error)
      console.log("Réponse du backend :", error.response?.data)
      console.log("Status :", error.response?.status)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent className="produit-sheet">
        {/* header du formulaire  */}
        <SheetHeader className="produit-sheet__header">
          <SheetTitle>
            {marque ? 'Modifier la marque' : 'Ajouter une marque'}
          </SheetTitle>

          <SheetDescription>
            Remplissez les informations puis cliquez sur Enregistrer.
          </SheetDescription>
        </SheetHeader>

        {/* formulaire ici */}
        <form id="produit-form" onSubmit={handleSubmit} className="produit-sheet__form">

          {/* ================= Informations générales ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Informations générales</h3>

            {/* ======== nom de la marque =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="titre">Nom</Label>
              <Input
                id="titre"
                placeholder="Ex : ABB"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
                required
              />
            </div>
            {/* ======== Site web de la marque  =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="description">Site web </Label>
              <Input
                id="description"
                placeholder="URL du site officiel"
                value={form.website}
                onChange={(e) =>
                  setForm({
                    ...form,
                    website: e.target.value
                  })
                }
              />
            </div>
          </section>

          <Separator />



          {/* ================= Fichiers ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Fichiers</h3>

            <div className="produit-sheet__row">
              {/* ======== logo de la marque  =========== */}
              <label className="produit-sheet__upload">
                <ImagePlus className="produit-sheet__upload-icon" />
                <span className="produit-sheet__upload-label">Logo</span>
                <span className="produit-sheet__upload-hint">
                  {imageFile ? imageFile.logo : 'PNG, JPG…'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setImageFile(e.target.files[0] ?? null)}
                />
              </label>
            </div>
          </section>

          <Separator />
        </form>

        {/* footer du formulaire  */}
        <SheetFooter className="produit-sheet__footer">
          <SheetClose asChild>
            <Button type="button" variant="outline" >Annuler</Button>
          </SheetClose>
          <Button type="submit" form="produit-form" >Enregistrer</Button>
        </SheetFooter>

      </SheetContent>

    </Sheet>
  )
}
