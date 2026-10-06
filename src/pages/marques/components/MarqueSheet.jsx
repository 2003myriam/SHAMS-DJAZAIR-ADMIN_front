// Panneau latéral (Sheet) qui s'ouvre pour ajouter ou modifier un produit.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FileText, ImagePlus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from '@/components/ui/sheet'
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
const EMPTY_FORM = {
  name: '',
  logo: '',
  isActive: false,
  website: '',

}
export function MarqueSheet({ open, onOpenChange, marque, onSave }) {

  const [form, setForm] = useState(marque ?? EMPTY_FORM) // Si marque existe, prends produit. Sinon, prends EMPTY_FORM.
  //Surveille la prop marque a chaque chnagement Si la valeur marque existe, utilise-la. Sinon, utilise emptyform
  useEffect(() => {
    setForm(marque ?? EMPTY_FORM)
  }, [marque])
  // Fichiers choisis (pour afficher leur nom)
  const [imageFile, setImageFile] = useState(null)

  // SOUMISSION DU FORMULAIRE 
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      if (marque) {

        // MODIFICATION
        const response = await axios.put(
          `http://localhost:5001/brand/${marque._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        toast.success("Marque modifiée avec succès")
        setForm(response.data.data)

      } else {

        // CRÉATION
        const response = await axios.post(
          "http://localhost:5001/brand",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        toast.success("Marque créée avec succès")
        setForm(response.data.data)
      }

    } catch (error) {
      console.log("Erreur lors de l'enregistrement :", error)
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
            {/* ======== Checkbox de la marque  =========== */}
            <div className="marque-sheet__checkbox-field">
              <Label htmlFor="isActive">Marque active</Label>
              <Checkbox
                id="isActive"
                className="marque-sheet__checkbox"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm({
                    ...form,
                    isActive: checked
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
