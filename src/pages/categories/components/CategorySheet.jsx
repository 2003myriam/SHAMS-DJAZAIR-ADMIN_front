// Panneau latéral (Sheet) qui s'ouvre pour ajouter une catégorie.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from '@/components/ui/sheet'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// Le Select n'accepte pas une valeur vide : "none" = aucune catégorie parent (null)
const NO_PARENT = 'none'

const EMPTY_FORM = {
  name: '',
  description: '',
  image: '',
  isActive: true,
  parentCategoryId: NO_PARENT,
}

export function CategorySheet({ open, onOpenChange, onSave }) {

  const [form, setForm] = useState(EMPTY_FORM)
  // liste des catégories parents pour le select
  const [parents, setParents] = useState([])

  // ==========================================
  // Récupération des catégories parents
  // ==========================================
  const getParents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/categories/parents')
      setParents(response.data.data || [])
    } catch (error) {
      toast.error("Impossible de récupérer les catégories parents.")
    }
  }

  // à chaque ouverture : formulaire vide + liste des parents à jour
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM)
      getParents()
    }
  }, [open])

  // SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      // CRÉATION
      await axios.post(
        "http://localhost:5001/categories",
        {
          ...form,
          // "none" => null (catégorie parent)
          parentCategoryId: form.parentCategoryId === NO_PARENT ? null : form.parentCategoryId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success("Catégorie créée avec succès")
      // recharger la liste des catégories dans la page parent
      onSave?.() // enregister sans rafrechir
      onOpenChange(false) // fermer le paneau apres enregistrement

    } catch (error) {
      toast.error(error.response?.data?.message || "Impossible de créer la catégorie.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent className="produit-sheet">
        {/* header du formulaire  */}
        <SheetHeader className="produit-sheet__header">
          <SheetTitle>Ajouter une catégorie</SheetTitle>

          <SheetDescription>
            Remplissez les informations puis cliquez sur Enregistrer.
          </SheetDescription>
        </SheetHeader>

        {/* formulaire ici */}
        <form id="category-form" onSubmit={handleSubmit} className="produit-sheet__form">

          {/* ================= Informations générales ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Informations générales</h3>

            {/* ======== nom de la catégorie =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                placeholder="Ex : Automatisation industrielle"
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

            {/* ======== description de la catégorie =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez la catégorie"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
              />
            </div>

            {/* ======== catégorie parent =========== */}
            <div className="produit-sheet__field">
              <Label>Catégorie parent</Label>
              <Select value={form.parentCategoryId}
                onValueChange={(parentCategoryId) =>
                  setForm({
                    ...form,
                    parentCategoryId: parentCategoryId
                  })
                }>
                <SelectTrigger className="produit-sheet__select">
                  <SelectValue placeholder="Choisir une catégorie parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={NO_PARENT}>Aucune (catégorie parent)</SelectItem>
                    {parents.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* ======== Checkbox de la catégorie  =========== */}
            <div className="marque-sheet__checkbox-field">
              <Label htmlFor="isActive">Catégorie active</Label>
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

          {/* ================= Image ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Image</h3>

            {/* ======== URL de l'image =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="image">URL de l'image</Label>
              <Input
                id="image"
                placeholder="https://..."
                value={form.image}
                onChange={(e) =>
                  setForm({
                    ...form,
                    image: e.target.value
                  })
                }
              />
            </div>
          </section>

          <Separator />
        </form>

        {/* footer du formulaire  */}
        <SheetFooter className="produit-sheet__footer">
          <SheetClose asChild>
            <Button type="button" variant="outline" >Annuler</Button>
          </SheetClose>
          <Button type="submit" form="category-form" >Enregistrer</Button>
        </SheetFooter>

      </SheetContent>

    </Sheet>
  )
}
