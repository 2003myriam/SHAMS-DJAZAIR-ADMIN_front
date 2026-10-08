// Panneau latéral (Sheet) qui s'ouvre pour ajouter ou modifier une demande de devis.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from '@/components/ui/sheet'
import { toast } from "sonner"
const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  products: [],
}
export function DevisSheet({ open, onOpenChange, devis, onSave }) {

  const [form, setForm] = useState(devis ?? EMPTY_FORM) // Si devis existe, prends devis. Sinon, prends EMPTY_FORM.
  //Surveille la prop devis a chaque changement Si la valeur devis existe, utilise-la. Sinon, utilise emptyform
  useEffect(() => {
    setForm(devis ?? EMPTY_FORM)
  }, [devis, open])

  /* Partie des produits demandés */
  //AJOUTER
  const addProduct = () => {
    setForm({
      ...form,
      products: [
        ...form.products,
        {
          productTitle: '',
          productReference: '',
          quantity: 1
        }
      ]
    })
  }
  //MODIFIER
  const updateProduct = (index, field, value) => {
    const newProducts = form.products.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    )

    setForm({ ...form, products: newProducts })
  }
  // SUPPRIMER
  const removeProduct = (index) => {
    const newProducts = form.products.filter(
      (_, i) => i !== index
    )

    setForm({ ...form, products: newProducts })
  }

  // SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      if (devis) {

        // MODIFICATION
        await axios.put(
          `http://localhost:5001/request/${devis._id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        toast.success("Demande modifiée avec succès")

      } else {

        // CRÉATION
        await axios.post(
          "http://localhost:5001/request",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        toast.success("Demande créée avec succès")
      }

      // rafraîchir la liste + fermer le panneau
      onSave?.()
      onOpenChange(false)

    } catch (error) {
      console.log("Erreur lors de l'enregistrement :", error)
      console.log("Réponse du backend :", error.response?.data)
      console.log("Status :", error.response?.status)
      toast.error("Impossible d'enregistrer la demande.")
    }
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent className="produit-sheet">
        {/* header du formulaire  */}
        <SheetHeader className="produit-sheet__header">
          <SheetTitle>
            {devis ? 'Modifier la demande' : 'Ajouter une demande'}
          </SheetTitle>

          <SheetDescription>
            Remplissez les informations puis cliquez sur Enregistrer.
          </SheetDescription>
        </SheetHeader>

        {/* formulaire ici */}
        <form id="devis-form" onSubmit={handleSubmit} className="produit-sheet__form">

          {/* ================= Informations du client ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Informations du client</h3>

            <div className="produit-sheet__row">
              {/* ======== Nom =========== */}
              <div className="produit-sheet__field">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      lastName: e.target.value
                    })
                  }
                  required
                />
              </div>
              {/* ======== Prénom =========== */}
              <div className="produit-sheet__field">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      firstName: e.target.value
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* ======== Email =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex : client@entreprise.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="produit-sheet__row">
              {/* ======== Téléphone =========== */}
              <div className="produit-sheet__field">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value
                    })
                  }
                  required
                />
              </div>
              {/* ======== Entreprise =========== */}
              <div className="produit-sheet__field">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  placeholder="Optionnel"
                  value={form.company}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      company: e.target.value
                    })
                  }
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* ================= Produits demandés ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Produits demandés</h3>

            {form.products.length === 0 && (
              <p className="produit-sheet__empty">
                Aucun produit pour le moment.
              </p>
            )}

            {form.products.map((product, index) => (
              <div key={product._id ?? index} className="devis-sheet__product">

                <Input
                  placeholder="Produit"
                  value={product.productTitle}
                  onChange={(e) =>
                    updateProduct(index, 'productTitle', e.target.value)
                  }
                  required
                />

                <Input
                  placeholder="Référence"
                  value={product.productReference}
                  onChange={(e) =>
                    updateProduct(index, 'productReference', e.target.value)
                  }
                />

                <Input
                  type="number"
                  min="1"
                  placeholder="Qté"
                  value={product.quantity}
                  onChange={(e) =>
                    updateProduct(index, 'quantity', Number(e.target.value))
                  }
                  required
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProduct(index)}
                  aria-label="Supprimer le produit"
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
              onClick={addProduct}
            >
              <Plus />
              Ajouter un produit
            </Button>
          </section>

          <Separator />

          {/* ================= Message ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Message</h3>
            <div className="produit-sheet__field">
              <Label htmlFor="message">Message du client</Label>
              <Textarea
                id="message"
                placeholder="Précisions sur la demande…"
                rows={4}
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value
                  })
                }
              />
            </div>
          </section>
        </form>

        {/* footer du formulaire  */}
        <SheetFooter className="produit-sheet__footer">
          <SheetClose asChild>
            <Button type="button" variant="outline" >Annuler</Button>
          </SheetClose>
          <Button type="submit" form="devis-form" >Enregistrer</Button>
        </SheetFooter>

      </SheetContent>

    </Sheet>
  )
}
