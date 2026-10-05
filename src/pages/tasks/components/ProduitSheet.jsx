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
  titre: '',
  description: '',
  reference: '',
  image: '',
  datasheet: '',
  technicalSpecifications: {},
  categoryId: '',
  brandId: ''
}
export function ProduitSheet({ open, onOpenChange, produit, onSave }) {

  const [form, setForm] = useState(produit ?? EMPTY_FORM) // Si produit existe, prends produit. Sinon, prends EMPTY_FORM.
  const [technicalSpecifications, setTechnicalSpecifications] = useState([])

  // Fichiers choisis (pour afficher leur nom)
  const [imageFile, setImageFile] = useState(null)

  /* Partie de specification datasheet  */
  const [datasheetFile, setDatasheetFile] = useState(null)
  //AJOUTER
  const addTechnicalSpecification = () => {
    setTechnicalSpecifications([
      ...technicalSpecifications,
      {
        name: '',
        value: ''
      }
    ])
  }
  //MODIFIER
  const updateTechnicalSpecification = (index, field, value) => {
    const newSpecifications = [...technicalSpecifications]

    newSpecifications[index][field] = value

    setTechnicalSpecifications(newSpecifications)
  }
  // SUPPRIMER
  const removeTechnicalSpecification = (index) => {
    const newSpecifications = technicalSpecifications.filter(
      (_, i) => i !== index
    )

    setTechnicalSpecifications(newSpecifications)
  }

  /* ¨Partie de la marque dans le formulaire  */
  const [marques, setMarques] = useState([])
  const getBrands = async () => {
    try {
      const response = await axios.get("http://localhost:5001/brand")
      setMarques(response.data.data)
    }
    catch {

    }
  }
  /* ¨Partie des categories dans le formulaire  */
  const [categories, setCategories] = useState([])
  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5001/categories")
      setCategories(response.data.data)
    }
    catch {

    }

  }
  // SOUMISSION DU FORMULAIRE 
  const handleSubmit = async (e) => {
    e.preventDefault()

    const specifications = {}

    technicalSpecifications.forEach((spec) => {
      if (spec.name.trim() !== '') {
        specifications[spec.name] = spec.value
      }
    })

    const finalForm = {
      ...form,
      technicalSpecifications: specifications
    }

    try {
      const token = localStorage.getItem("token")

      const response = await axios.post(
        "http://localhost:5001/products",
        finalForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      console.log("Produit créé :", response.data)

      setForm(response.data.data)
    }
    catch (error) {
      console.log("Erreur lors de la création du produit :", error)
      console.log("Réponse du backend :", error.response?.data)
      console.log("Status :", error.response?.status)
    }
  }
  // Exécuter getBrands au chargement du composant
  useEffect(() => {
    getBrands();
    getCategories();
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent className="produit-sheet">
        {/* header du formulaire  */}
        <SheetHeader className="produit-sheet__header">
          <SheetTitle>
            {produit ? 'Modifier le produit' : 'Ajouter un produit'}
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

            {/* ======== Titre produit =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="titre">Titre</Label>
              <Input
                id="titre"
                placeholder="Ex : Disjoncteur 16A"
                value={form.titre}
                onChange={(e) =>
                  setForm({
                    ...form,
                    titre: e.target.value
                  })
                }
                required
              />
            </div>

            {/* ======== Refernce produit =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                placeholder="Ex : REF-00123"
                value={form.reference}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reference: e.target.value
                  })
                }
              />
            </div>

            {/* ======== Description produit =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez le produit…"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
              />
            </div>
          </section>

          <Separator />

          {/* ================= Classement ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Classement</h3>

            <div className="produit-sheet__row">
              {/* ========  Marques  =========== */}
              <div className="produit-sheet__field">
                <Label>Marque</Label>
                <Select value={form.brandId}
                  onValueChange={(brandId) =>
                    setForm({
                      ...form,
                      brandId: brandId
                    })
                  }>
                  <SelectTrigger className="produit-sheet__select">
                    <SelectValue placeholder="Choisir une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {marques.map((b) => (
                        <SelectItem key={b._id} value={b._id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* ========  Categories  =========== */}
              <div className="produit-sheet__field">
                <Label>Catégorie</Label>
                <Select value={form.categoryId}
                  onValueChange={(categoryId) =>
                    setForm({
                      ...form,
                      categoryId: categoryId
                    })
                  }>
                  <SelectTrigger className="produit-sheet__select">
                    <SelectValue placeholder="Choisir une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* ================= Fichiers ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Fichiers</h3>

            <div className="produit-sheet__row">
              {/* ======== Image produit =========== */}
              <label className="produit-sheet__upload">
                <ImagePlus className="produit-sheet__upload-icon" />
                <span className="produit-sheet__upload-label">Image</span>
                <span className="produit-sheet__upload-hint">
                  {imageFile ? imageFile.name : 'PNG, JPG…'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setImageFile(e.target.files[0] ?? null)}
                />
              </label>

              {/* ======== Fiche technique produit =========== */}
              <label className="produit-sheet__upload">
                <FileText className="produit-sheet__upload-icon" />
                <span className="produit-sheet__upload-label">Fiche technique</span>
                <span className="produit-sheet__upload-hint">
                  {datasheetFile ? datasheetFile.name : 'PDF'}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => setDatasheetFile(e.target.files[0] ?? null)}
                />
              </label>
            </div>
          </section>

          <Separator />

          {/* ======== Caractéristiques techniques ======== */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Caractéristiques techniques</h3>

            {technicalSpecifications.length === 0 && (
              <p className="produit-sheet__empty">
                Aucune caractéristique pour le moment.
              </p>
            )}

            {technicalSpecifications.map((spec, index) => (
              <div key={index} className="produit-sheet__spec">

                <Input
                  placeholder="Nom (ex : Tension)"
                  value={spec.name}
                  onChange={(e) =>
                    updateTechnicalSpecification(
                      index,
                      'name',
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Valeur (ex : 230 V)"
                  value={spec.value}
                  onChange={(e) =>
                    updateTechnicalSpecification(
                      index,
                      'value',
                      e.target.value
                    )
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTechnicalSpecification(index)}
                  aria-label="Supprimer la caractéristique"
                >
                  <Trash2 />
                </Button>

              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="produit-sheet__add"
              onClick={addTechnicalSpecification}
            >
              <Plus />
              Ajouter une caractéristique
            </Button>
          </section>

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
